from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)
    bcrypt.init_app(app)

    # Import models here to ensure they are registered with SQLAlchemy
    from models import User, SearchHistory

    with app.app_context():
        db.create_all()

    return app