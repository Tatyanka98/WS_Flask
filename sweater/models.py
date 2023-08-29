from flask_login import UserMixin
from sweater import db, manager


class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(25), nullable=False, unique=True)
    permission = db.Column(db.String(7), nullable=False, default='student')
    password = db.Column(db.String(25), nullable=False)
    url_tg = db.Column(db.String(100), nullable=True)
    url_gh = db.Column(db.String(100), nullable=True)
    url_vk = db.Column(db.String(100), nullable=True)
    groups = db.Column(db.String, nullable=True)  # IDs FK Groups
    description = db.Column(db.String, nullable=True)
    full_name = db.Column(db.String, nullable=False)  # JSON
    birthday = db.Column(db.Date, nullable=True)
    gender = db.Column(db.String(1), nullable=True)
    email = db.Column(db.String(50), nullable=True)
    passport = db.Column(db.String, nullable=True)  # JSON
    address = db.Column(db.String, nullable=True)  # JSON
    insurance = db.Column(db.String(11), nullable=True)
    education = db.Column(db.String, nullable=True)  # JSON
    theme = db.Column(db.Integer, default=0)
    color = db.Column(db.Integer, default=0)


class News(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    author = db.Column(db.ForeignKey(Users.id), nullable=False)
    text = db.Column(db.String, nullable=False)
    date = db.Column(db.Date, nullable=False)


class Directions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    cabinet = db.Column(db.String(10), nullable=False)


class Groups(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    teacher = db.Column(db.ForeignKey(Users.id), nullable=False)
    students = db.Column(db.String, nullable=True)  # IDs FK Users
    lessons = db.Column(db.String, nullable=True)  # IDs FK Lessons
    schedule = db.Column(db.String, nullable=True)  # JSON
    direction = db.Column(db.ForeignKey(Directions.id), nullable=False)


class Lessons(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String, nullable=True)
    date = db.Column(db.Date, nullable=False)
    attendance = db.Column(db.String, nullable=True)  # JSON


class Projects(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String, nullable=True)
    directions = db.Column(db.String, nullable=True)  # IDs FK Directions
    attendance = db.Column(db.String, nullable=True)  # IDs FK Users
    status = db.Column(db.String(1), nullable=True)
    teachers = db.Column(db.String, nullable=True)  # IDs FK Users
    level = db.Column(db.String(1), nullable=True)
    leader = db.Column(db.ForeignKey(Users.id), nullable=False)
    desk = db.Column(db.String, nullable=True)  # JSON
    chat = db.Column(db.String, nullable=True)  # IDs FK Messages


class Mails(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    from_user = db.Column(db.ForeignKey(Users.id), nullable=False)
    to_user = db.Column(db.ForeignKey(Users.id), nullable=False)
    title = db.Column(db.String(50), nullable=False)
    text = db.Column(db.String, nullable=False)
    attachments = db.Column(db.String, nullable=True)  # path
    is_read = db.Column(db.Boolean, nullable=False)
    is_important = db.Column(db.Boolean, nullable=False)


class Messages(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    from_user = db.Column(db.ForeignKey(Users.id), nullable=False)
    text = db.Column(db.String, nullable=False)


class Keys(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(32), nullable=False)
    permission = db.Column(db.String(7), nullable=False, default='student')


@manager.user_loader
def load_user(user_id):
    return Users.query.get(user_id)
