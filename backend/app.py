from flask import Flask, render_template, request, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from datetime import datetime
import json
import os
import notifications
import logging

logging.basicConfig(
    filename="log.log",
    encoding="utf-8",
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
        return '<Item %r>' % self.id

class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    review = db.Column(db.String(1000), nullable=False)
    stars = db.Column(db.Integer, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return '<Item %r>' % self.id

# Create a Schema to be used by marrshmallow for serialisation
class ShoppingItemSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ShoppingItem

class RatingSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Rating

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tasklist/delete/<int:id>')
def delete(id):
    task_to_delete = ShoppingItem.query.get_or_404(id)

    try:
        db.session.delete(task_to_delete)
        db.session.commit()
        return redirect('/tasklist/')
    
    except:
        return 'There was a problem deleting that task'

@app.route('/tasklist/update/<int:id>', methods=['POST'])
def update(id):
    task = ShoppingItem.query.get_or_404(id)

    data = request.get_data()
    data = json.loads(data)
    # task.content = data['content']
    task.completed = data['completed']
    task.date_updated = datetime.utcnow()

    try:
        db.session.commit()
        return "Updated your item!", 200

    except:
        return 'There was an issue updating your task', 500

@app.route('/tasklist/', methods=['GET'])
def tasklist():
    tasks = ShoppingItem.query.order_by(ShoppingItem.date_created).all()
    task_schema = ShoppingItemSchema(many=True)
    output = task_schema.dump(tasks)

    return {"tasks": output}

@app.route("/tasklist/create/", methods=['POST'])
def tasklistadd():
    data = request.get_data()
    data = json.loads(data)
    shopping_item = data['content']
    new_item = ShoppingItem(content=shopping_item)

    try:
        db.session.add(new_item)
        db.session.commit()
        return "Added item to shopping list", 200
    except:
        return "Issue adding that item to the shopping list", 500

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
        except:
            return 'There was an issue adding your task'

    else:
        tasks = ShoppingItem.query.order_by(ShoppingItem.date_created).all()
        return render_template('tasklist.html', tasks=tasks)

@app.route('/ratings/', methods=['GET'])
def ratings():
    ratings = Rating.query.order_by(db.desc(Rating.date_created)).all()
    ratings_schema = RatingSchema(many=True)
    output = ratings_schema.dump(ratings)

    return {"ratings": output}

@app.route('/ratings/create/', methods=['POST'])
def CreateRating():
    data = request.get_data()
    data = json.loads(data)
    name = data['name']
    title = data['title']
    review = data['review']
    stars = int(data['stars'])

    newReview = Rating(name=name, title=title, review=review, stars=stars)

    try:
        db.session.add(newReview)
        db.session.commit()
        return "Added new review", 200
    except:
        return "Issue adding that review", 500



@app.route('/houserules/')
def houserules():
    return render_template("houserules.html")

@app.route('/announcements/', methods=['POST'])
def announcement():
    try:
        data = request.get_data()
        data = json.loads(data)
        sender = data['sender']
        title = data['title']
        message = data['message']
        icon = int(data['icon'])
        t = "[{}] {}".format(sender, title)
        notifications.SendNotification(t, message, icon, dev=False)
        return "Notification Sent", 200 
    except Exception as e:
        logging.exception(e)
        return "Bad", 500

@app.route('/announcements/senders/', methods=['GET'])
def senders():
    senders = ['Jonny', 'Fraser', 'Doug', 'Mia']
    return {"senders": senders}

if __name__ == "__main__":
    app.run()