"""
Flask app API for House Website
"""

from copy import deepcopy
from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from datetime import datetime
from library import parse_times
from dotenv import load_dotenv
import json
import os
import notifications
import logging
import requests
import trash
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr
import smtplib
import ssl

load_dotenv()

logging.basicConfig(
  handlers=[logging.FileHandler(filename='./log.log',
    encoding='utf-8',
    mode='a+')
  ],
  level=logging.DEBUG,
  format='%(asctime)s %(message)s',
  datefmt='%m/%d/%Y %I:%M:%S %p'
)

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] =\
        'sqlite:///' + os.path.join(basedir, 'house.db')

db = SQLAlchemy(app)
ma = Marshmallow(app)

# Create Schema for SQLAlchemy ie the database
class ShoppingItem(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  content = db.Column(db.String(200), nullable=False)
  date_created = db.Column(db.DateTime, default=datetime.utcnow)
  date_updated = db.Column(db.DateTime, default=datetime.utcnow)
  completed = db.Column(db.Boolean, default=False, nullable=False)

  def __repr__(self):
    return r'<Item {self.id}>'

class Rating(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(200), nullable=False)
  title = db.Column(db.String(200), nullable=False)
  review = db.Column(db.String(1000), nullable=False)
  stars = db.Column(db.Integer, nullable=False)
  date_created = db.Column(db.DateTime, default=datetime.utcnow)

  def __repr__(self):
    return r'<Item {self.id}>'

# Create a Schema to be used by marrshmallow for serialisation
class ShoppingItemSchema(ma.SQLAlchemyAutoSchema):
  class Meta:
    model = ShoppingItem

class RatingSchema(ma.SQLAlchemyAutoSchema):
  class Meta:
    model = Rating

class Bins(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  colour = db.Column(db.String(200), nullable=False)
  collection_date = db.Column(db.DateTime)

class BinsSchema(ma.SQLAlchemyAutoSchema):
  class Meta:
    model = Bins

def update_bin_file():
  bin_data = trash.get_bin_data()
  bin_list = deepcopy(bin_data).Jsonify()
  dtnow = str(datetime.utcnow())
  bin_dict = {
    'date_refreshed' : dtnow,
    'bins' : bin_list
  }

  with open('bins.json', 'w+', encoding='UTF-8') as bin_file:
    json.dump(bin_dict, bin_file)

  return bin_data

def send_email(sender, receiver, html):

  text = """\
  Dear user,
  Something has gone wrong (500).
  Many Thanks,
  Menu Sender"""
  email_username= os.getenv('EMAIL_USER')
  email_pass = os.getenv('EMAIL_PASS')
  msg = MIMEMultipart('alternative')
  msg['From'] = formataddr(('Exeter College Ball Refunds', sender))
  msg['To'] = receiver
  msg['Subject'] = 'Ticket Refund Request'

  part1 = MIMEText(text, 'plain')
  part2 = MIMEText(html, 'html')

  msg.attach(part1)
  msg.attach(part2)

  context = ssl.create_default_context()

  with smtplib.SMTP_SSL('mail.exetercollegeball.co.uk', 465, context=context) as server:
    server.login(email_username, email_pass)
    server.sendmail(sender, receiver, msg.as_string())
    server.quit()


@app.route('/')
def index():
  return render_template('index.html')

@app.route('/tasklist/delete/<int:task_id>')
def delete(task_id):
  task_to_delete = ShoppingItem.query.get_or_404(task_id)

  try:
    db.session.delete(task_to_delete)
    db.session.commit()
    return redirect('/tasklist/')

  except Exception:
    return 'There was a problem deleting that task'

@app.route('/tasklist/update/<int:task_id>', methods=['POST'])
def update(task_id):
  task = ShoppingItem.query.get_or_404(task_id)

  data = request.get_data()
  data = json.loads(data)
  # task.content = data['content']
  task.completed = data['completed']
  task.date_updated = datetime.utcnow()

  try:
    db.session.commit()
    return 'Updated your item!', 200

  except Exception:
    return 'There was an issue updating your task', 500

@app.route('/tasklist/', methods=['GET'])
def tasklist():
  tasks = ShoppingItem.query.order_by(ShoppingItem.date_created).all()
  task_schema = ShoppingItemSchema(many=True)
  output = task_schema.dump(tasks)

  return {'tasks': output}

@app.route('/tasklist/create/', methods=['POST'])
def tasklistadd():
  data = request.get_data()
  data = json.loads(data)
  shopping_item = data['content']
  new_item = ShoppingItem(content=shopping_item)

  try:
    db.session.add(new_item)
    db.session.commit()
    return 'Added item to shopping list', 200
  except Exception:
    return 'Issue adding that item to the shopping list', 500

# Keep to display data for testing
@app.route('/tasklistshow/', methods=['POST', 'GET'])
def tasklistshow():
  # return render_template('tasklist.html')
  if request.method == 'POST':
    task_content = request.form['content']
    new_task = ShoppingItem(content=task_content)

    try:
      db.session.add(new_task)
      db.session.commit()
      return redirect('/tasklist/')
    except Exception:
      return 'There was an issue adding your task'

  else:
    tasks = ShoppingItem.query.order_by(ShoppingItem.date_created).all()
    return render_template('tasklist.html', tasks=tasks)

@app.route('/ratings/', methods=['GET'])
def ratings():
  all_ratings = Rating.query.order_by(db.desc(Rating.date_created)).all()
  ratings_schema = RatingSchema(many=True)
  output = ratings_schema.dump(all_ratings)

  return {'ratings': output}

@app.route('/ratings/create/', methods=['POST'])
def create_rating():
  data = request.get_data()
  data = json.loads(data)
  name = data['name']
  title = data['title']
  review = data['review']
  stars = int(data['stars'])

  new_review = Rating(name=name, title=title, review=review, stars=stars)

  try:
    db.session.add(new_review)
    db.session.commit()
    t = 'Someone Reviewed Your House !'
    message = f'Check the website to see what "{name}" had to say...'
    # this icon is a speech bubble
    notifications.send_notification(t, message, icon=33, dev=False)

    return 'Added new review', 200
  except Exception:
    return 'Issue adding that review', 500

@app.route('/libraries/')
def libraries():
  url = 'https://www.bodleian.ox.ac.uk/api/oxdrupal_listings/1782151/52517876'

  library_page = requests.get(url, timeout=10)
  data = library_page.json()
  libs = data['items']

  library_data = []

  for lib in libs:
    temp = {}
    image = str(lib['rendered_image'])
    first = image.find('src')
    image = image[(first+5):]
    second = image.find('"')
    image = image[:(second)]

    temp['name'] = lib['title']
    temp['img'] = image
    temp['times'] = parse_times(lib['teaser_text'])
    library_data.append(temp)

  return {'libraries' : library_data}

@app.route('/ball/refund', methods=['POST'])
def send_refund():
  data = request.get_data()
  data = json.loads(data)
  name = data['name']
  email = data['email']
  ticket_type = data['ticket']
  num_tickets = data['no_ticket']
  reason = data['reason']

  with open('static/email.html', encoding='UTF-8') as f:
    html = f.read()

  html = html.replace('=name=', name)
  html = html.replace('=email=', email)
  html = html.replace('=type=', ticket_type)
  html = html.replace('=number=', num_tickets)
  html = html.replace('=reason=', reason)
  html = str(html)

  send_email('refund@exetercollegeball.co.uk', 'fraser.rennie@exeter.ox.ac.uk', html)

  return 'Sent Refund Request', 200

@app.route('/houserules/')
def houserules():
  return render_template('houserules.html')

@app.route('/announcements/', methods=['POST'])
def announcement():
  try:
    data = request.get_data()
    data = json.loads(data)
    sender = data['sender']
    title = data['title']
    message = data['message']
    icon = int(data['icon'])
    t = f'[{sender}] {title}'
    notifications.send_notification(t, message, icon, dev=False)
    return 'Notification Sent', 200

  except Exception as e:
    logging.exception(e)
    return 'Bad', 500

@app.route('/announcements/senders/', methods=['GET'])
def senders():
  senders_list = ['Jonny', 'Fraser', 'Doug', 'Mia']
  return {'senders': senders_list}

@app.route('/bins/', methods=['GET'])
def bindicator():
  """
  send info from bins json file
  """
  with open('bins.json', encoding='UTF-8') as bin_file:
    bin_data = json.load(bin_file)

  return bin_data

@app.route('/bins/update/', methods=['GET'])
def update_bins():
  """
  get bin info from council website and write to json file
  """
  update_bin_file()
  return 'Bin Information Updated', 200

@app.route('/bins/notify', methods=['GET'])
def bins_notify():
  my_bins = update_bin_file()
  notif = my_bins.SendMessage()

  if notif:
    return 'Bin Notification Sent', 200
  else:
    return 'Dev Notification Sent', 200


if __name__ == '__main__':
  app.run(debug=True)
