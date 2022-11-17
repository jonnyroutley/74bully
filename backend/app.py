from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
with app.app_context():
    db = SQLAlchemy(app)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return '<Task %r>' % self.id

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/tasklist/delete/<int:id>')
def delete(id):
    task_to_delete = Todo.query.get_or_404(id)

    try:
        db.session.delete(task_to_delete)
        db.session.commit()
        return redirect('/tasklist/')
    
    except:
        return 'There was a problem deleting that task'

@app.route('/tasklist/update/<int:id>', methods=['GET', 'POST'])
def update(id):
    task = Todo.query.get_or_404(id)

    if request.method == 'POST':
        task.content = request.form['content']

        try:
            db.session.commit()
            return redirect('/tasklist/')

        except:
            return 'There was an issue updating your task'

    else:
        return render_template('update.html', task=task)

@app.route('/tasklist/', methods=['POST', 'GET'])
def tasklist():
    # return render_template('tasklist.html')
    if request.method == 'POST':
        task_content = request.form['content']
        new_task = Todo(content=task_content)

        try:
            db.session.add(new_task)
            db.session.commit()
            return redirect('/tasklist/')
        except:
            return 'There was an issue adding your task'

    else:
        tasks = Todo.query.order_by(Todo.date_created).all()
        # return render_template('tasklist.html', tasks=tasks)
        my_tasks = {
            "hi": "this is coool",
        }
        return my_tasks


@app.route('/houserules/')
def houserules():
    return render_template("houserules.html")

if __name__ == "__main__":
    app.run(debug=True)