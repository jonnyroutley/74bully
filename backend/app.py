"""
Flask app API for House Website
"""

from copy import deepcopy
from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_migrate import Migrate
from datetime import datetime, timedelta
from library import parse_times
from dotenv import load_dotenv
import json
import math
import os
import notifications
import logging
import requests
import trash
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr
from pdfgenerator import generate_pdf
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
migrate = Migrate(app,db)

ma = Marshmallow(app)

# Create Schema for SQLAlchemy ie the database
class ShoppingItem(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  content = db.Column(db.String(200), nullable=False)
  date_created = db.Column(db.DateTime, default=datetime.utcnow)
  date_updated = db.Column(db.DateTime, default=datetime.utcnow)
  completed = db.Column(db.Boolean, default=False, nullable=False)
  quantity = db.Column(db.Integer, default=1)

  def __repr__(self):
    return r'<Item {self.id}>'

class Rating(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(200), nullable=False)
  title = db.Column(db.String(200), nullable=False)
  review = db.Column(db.String(1000), nullable=False)
  stars = db.Column(db.Integer, nullable=False)
  date_created = db.Column(db.DateTime, default=datetime.utcnow)
  archive = db.Column(db.Boolean, default=False)

  def __repr__(self):
    return r'<Item {self.id}>'

class Event(db.Model):
  __tablename__ = 'event'
  id = db.Column(db.Integer, primary_key=True)
  title = db.Column(db.String(500), nullable=False)
  desc = db.Column(db.String(1000), nullable=False)
  time_and_date = db.Column(db.DateTime, default=datetime.utcnow)
  location = db.Column(db.String(400), nullable=False)
  feature = db.Column(db.String(400), nullable=True)
  date_created = db.Column(db.DateTime, default=datetime.utcnow)
  date_updated = db.Column(db.DateTime, default=datetime.utcnow)
  comments = db.relationship('EventComment', back_populates='event')

  def __repr__(self):
    return r'<Item {self.id}>'

class EventComment(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  event_id = db.Column(db.Integer, db.ForeignKey('event.id'))
  person = db.Column(db.String(200), nullable=True)
  content = db.Column(db.String(1000), nullable=False)
  archived = db.Column(db.Boolean, nullable=False, default=False)
  date_created = db.Column(db.DateTime, default=datetime.utcnow)

  event = db.relationship('Event', back_populates='comments')

  def __repr__(self):
    return r'<Comment {self.id}>'

class Reading(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  location = db.Column(db.String(100), nullable=False)
  temperature = db.Column(db.Float, nullable=False)
  humidity = db.Column(db.Float, nullable=False)
  epoch = db.Column(db.Float, nullable=False)

class Pee(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(200), nullable=False)
  comment = db.Column(db.String(1000), nullable=True)
  date_created = db.Column(db.DateTime, default=datetime.utcnow)

# Create a Schema to be used by marrshmallow for serialisation
class ShoppingItemSchema(ma.SQLAlchemyAutoSchema):
  class Meta:
    model = ShoppingItem

class EventCommentSchema(ma.SQLAlchemyAutoSchema):
  class Meta:
    model = EventComment
class EventSchema(ma.SQLAlchemyAutoSchema):
  comments = ma.Nested(EventCommentSchema, many=True)
  class Meta:
    model = Event
    load_instance = True

class RatingSchema(ma.SQLAlchemyAutoSchema):
  class Meta:
    model = Rating

class PeeSchema(ma.SQLAlchemyAutoSchema):
  class Meta:
    model = Pee
    
class ReadingSchema(ma.SQLAlchemyAutoSchema):
  class Meta:
    model = Reading

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

def send_email(sender, receiver, msg):

  email_username= os.getenv('EMAIL_USER')
  email_pass = os.getenv('EMAIL_PASS')

  context = ssl.create_default_context()

  with smtplib.SMTP_SSL('mail.exetercollegeball.co.uk', 465, context=context) as server:
    server.login(email_username, email_pass)
    server.sendmail(sender, receiver, msg.as_string())
    logging.info('Sent mail to %s', receiver)
    server.quit()

def older_than_a_week(dt):
  d = datetime.strptime(dt)
  now = datetime.now()
  # return true if date is older than a week
  return (now-d).days > 7


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
  # tasks = ShoppingItem.query.filter_by(completed=1 and )
  # for task in tasks:
  #   if task['completed'] and older_than_a_week(task['date_updated']):


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
def all_ratings():
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

@app.route('/ratings/archive/<int:rating_id>', methods=['PATCH'])
def update_rating(rating_id):
  rating = Rating.query.get_or_404(rating_id)
  # data = request.get_json()
  rating.archive = not rating.archive
  db.session.commit()
  return f'Archive Status Updated for ID: {rating_id}', 200

@app.route('/ratings/total/', methods=['GET'])
def total_rating():
  ratings = Rating.query.all()
  num_rows = db.session.query(Rating).count()
  score = 0
  for r in ratings:
    if not r.archive:
      score += r.stars
    else:
      num_rows -= 1
  ave = round(score/num_rows, 2)
  out = {'average': ave, 'number': num_rows}
  return out, 200

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

  with open('static/refund_email.html', encoding='UTF-8') as f:
    html = f.read()

  html = html.replace('=name=', name)
  html = html.replace('=email=', email)
  html = html.replace('=type=', ticket_type)
  html = html.replace('=number=', num_tickets)
  html = html.replace('=reason=', reason)
  html = str(html)

  sender = 'no-reply@exetercollegeball.co.uk'
  recipients = ['fraser.rennie@exeter.ox.ac.uk', 'anna.barrett@exeter.ox.ac.uk']

  text = """\
  Dear user,
  Something has gone wrong (500).
  Many Thanks,
  Menu Sender"""

  msg = MIMEMultipart('alternative')
  msg['From'] = formataddr(('Exeter College Ball', sender))
  msg['To'] = ', '.join(recipients)
  msg['Subject'] = 'Ticket Refund Request'

  part1 = MIMEText(text, 'plain')
  part2 = MIMEText(html, 'html')

  msg.attach(part1)
  msg.attach(part2)

  send_email(sender, recipients, msg)

  # Send notification to user

  with open('static/refund_email_return.html', encoding='UTF-8') as f:
    html2 = f.read()

  html2 = html2.replace('=name=', name)

  msg2 = MIMEMultipart('alternative')
  msg2['From'] = formataddr(('Exeter College Ball', sender))
  msg2['To'] = email
  msg2['Subject'] = 'Ticket Refund Request'

  part3 = MIMEText(text, 'plain')
  part4 = MIMEText(html2, 'html')

  msg2.attach(part3)
  msg2.attach(part4)

  send_email(sender, email, msg2)

  return 'Sent Refund Request', 200

@app.route('/ball/access', methods=['POST'])
def send_access():
  data = request.get_data()
  data = json.loads(data)
  fname = data['fname']
  lname = data['lname']
  email = data['email']
  additional = data['additional']
  year = data['year']
  subject = data['subject']
  priority = data['priority']

  file_name = generate_pdf(fname, lname, email, additional, year, subject, int(priority))

  with open('static/access_email.html', encoding='UTF-8') as f:
    html = f.read()

  html = html.replace('{{fname}}', fname)
  html = html.replace('{{lname}}', lname)
  html = html.replace('{{email}}', email)
  html = html.replace('{{year}}', year)
  html = html.replace('{{subject}}', subject)

  sender = 'no-reply@exetercollegeball.co.uk'
  receiver = 'anna.barrett@exeter.ox.ac.uk'

  text = """\
  Dear user,
  Something has gone wrong (500).
  Many Thanks,
  Menu Sender"""

  msg = MIMEMultipart('alternative')
  msg['From'] = formataddr(('Exeter College Ball', sender))
  msg['To'] = receiver
  msg['Subject'] = 'Student Access Ticket Request'

  part1 = MIMEText(text, 'plain')
  part2 = MIMEText(html, 'html')

  with open(file_name, 'rb') as f:
    #attach = email.mime.application.MIMEApplication(f.read(),_subtype="pdf")
    attach = MIMEApplication(f.read(),_subtype='pdf')
  attach.add_header('Content-Disposition','attachment',filename=str(file_name))
  msg.attach(attach)

  msg.attach(part1)
  msg.attach(part2)

  send_email(sender, receiver, msg)

  # Now send to person who filled out form.

  with open('static/access_email_return.html', encoding='UTF-8') as f:
    html2 = f.read()

  html2 = html2.replace('{{fname}}', fname)

  msg2 = MIMEMultipart('alternative')
  msg2['From'] = formataddr(('Exeter College Ball', sender))
  msg2['To'] = email
  msg2['Subject'] = 'Student Access Ticket Request'

  part3 = MIMEText(text, 'plain')
  part4 = MIMEText(html2, 'html')

  with open(file_name, 'rb') as f:
    #attach = email.mime.application.MIMEApplication(f.read(),_subtype="pdf")
    attach = MIMEApplication(f.read(),_subtype='pdf')
  attach.add_header('Content-Disposition','attachment',filename=str(file_name))
  msg2.attach(attach)

  msg2.attach(part3)
  msg2.attach(part4)

  send_email(sender, email, msg2)

  return 'Sent PDF', 200

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

@app.route('/dwellers/', methods=['GET'])
def senders():
  senders_list = ['Jonny', 'Fraser', 'Doug', 'Mia']
  return {'dwellers': senders_list}

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

@app.route('/events/', methods=['GET'])
def get_events():
  """
  Get all of the events
  """
  future_events = Event.query.order_by(Event.time_and_date.asc()).filter(db.func.datetime(Event.time_and_date) >= datetime.today()).all()
  past_events = Event.query.order_by(Event.time_and_date.desc()).filter(db.func.datetime(Event.time_and_date) < datetime.today()).all()
  event_schema = EventSchema(many=True)
  future = event_schema.dump(future_events)
  past = event_schema.dump(past_events)

  return {'future_events': future, 'past_events': past}

@app.route('/events/create/', methods=['POST'])
def create_event():
  data = request.get_data()
  data = json.loads(data)
  title = data['title']
  desc = data['desc']
  location = data['location']
  key = data['image']
  time_and_date = datetime.fromisoformat(data['eventTime'])

  bucket = os.getenv('BUCKET')
  region = os.getenv('REGION')

  url = f'https://{bucket}.s3.{region}.amazonaws.com/{key}'
  new_event = Event(title=title, desc=desc, location=location, time_and_date=time_and_date, feature=url)

  try:
    db.session.add(new_event)
    db.session.commit()

    return 'Added new event', 200
  except Exception:
    return 'Issue adding that event', 500

@app.route("/events/delete/<int:event_id>", methods=['DELETE'])
def delete_event(event_id):
  event = Event.query.get_or_404(event_id)
  db.session.delete(event)
  db.session.commit()
  return f'Deleted event: {event_id}', 200

@app.route("/events/comment/create/<int:event_id>", methods=['POST'])
def create_commend(event_id):
  event = Event.query.get_or_404(event_id)
  if not event: return 'Event not found', 404

  data = request.get_data()
  data = json.loads(data)

  person = data['person']
  content = data['content']

  new_comment = EventComment(person=person, content=content, event_id=event_id)

  try:
    db.session.add(new_comment)
    db.session.commit()

    return 'Comment Added', 200

  except Exception:
    return 'Issue adding that comment', 500

@app.route('/reading/<int:offset>', methods=['GET'])
def get_readings(offset):
  hrs24 = datetime.now() - timedelta(hours=offset)
  hrs24 = hrs24.timestamp()
  readings = Reading.query.order_by(Reading.epoch).filter(Reading.epoch >= hrs24)
  readingschema = ReadingSchema(many=True)
  output = readingschema.dump(readings)

  with open('location.txt', 'r', encoding='UTF-8') as f:
    location = f.read()

  dates = []
  temps = []
  humid = []

  for reading in output:
    temps.append(reading['temperature'])
    humid.append(reading['humidity'])
    temp_time = math.floor(reading['epoch']*1000)
    dates.append(temp_time)

  return {'temperatures' : temps, 'humidities': humid, 'dates': dates,'location': location}, 200

@app.route('/reading/add/', methods=['POST'])
def add_reading():
  data = request.get_data()
  data = json.loads(data)
  temperature = data['temperature']
  humidity = data['humidity']
  epoch = data['createdAt']
  # read location from config file
  with open('location.txt', 'r', encoding='UTF-8') as f:
    location = f.read()

  reading = Reading(location=location, temperature=temperature, humidity=humidity, epoch=epoch)
  try:
    db.session.add(reading)
    db.session.commit()
    return 'Added new reading', 200
  except Exception:
    logging.error('Failed to record reading.')
    return 'Issue adding that reading', 500

@app.route('/reading/location/', methods=['POST'])
def set_location():
  data = request.get_data()
  data = json.loads(data)
  loc = data['location']
  with open('location.txt', 'w+', encoding='UTF-8') as f:
    f.write(loc)
  return f'Location set to {loc}', 200

@app.route('/urinations', methods=['GET', 'POST'])
def add_urinate_record():
  if request.method == 'POST':
    data = request.get_data()
    data = json.loads(data)
    name = data['name']
    comment = data['comment']

    pee = Pee(name=name, comment=comment)

    try:
      db.session.add(pee)
      db.session.commit()
      return 'Added new record of pee', 200
    except Exception as e:
      logging.error('Failed to record pee.')
      logging.exception(e)
      return 'Issue recording your pee', 500
  
  elif request.method == 'GET':
    pees = Pee.query.order_by(Pee.date_created)
    peeschema = PeeSchema(many=True)
    output = peeschema.dump(pees)

    return {'urinations': output}, 200

if __name__ == '__main__':
  app.run(debug=True)
