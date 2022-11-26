from app import app, db, ShoppingItem

with app.app_context():
  db.create_all()
  admin = ShoppingItem(content='This is the first test')
  db.session.add(admin)
  db.session.commit()