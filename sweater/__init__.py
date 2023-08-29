from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager


application = Flask(__name__)
application.secret_key = '4KvantRZDwsInFlask4'
application.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
application.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(application)
manager = LoginManager(application)

application.app_context().push()

from sweater import models, routes_page, routes_req

db.create_all()

