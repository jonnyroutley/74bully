from app import app, db, ShoppingItem, Rating

with app.app_context():
  db.create_all()
  admin = ShoppingItem(content='This is the first test')
  db.session.add(admin)
  rating = Rating(name="Fraser", title="This is the first review", review="Since this is the first review, I best put some effort in. This house is a joy to live in - great people and a solid house.", stars=5)
  db.session.add(rating)
  db.session.commit()