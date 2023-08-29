import json
from flask import render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from sweater import application, db
from sweater.models import Users, Keys


@application.route('/')
@application.route('/news')
def index_page():
    if current_user.is_authenticated:
        return render_template('mainpage.html', user=current_user)
    else:
        return redirect(url_for('login_page'))


@application.route('/login', methods=['POST', 'GET'])
def login_page():
    if request.method == 'POST':
        login = request.form.get('username')
        password = request.form.get('password')
        if login and password:
            try:
                user = Users.query.filter_by(login=login).first()
                if check_password_hash(user.password, password):
                    login_user(user)
                    return redirect(url_for('index_page'))
                else:
                    flash('Неправильный пароль')
            except:
                flash('Такого пользователя не существует')
        else:
            flash('Заполните поля и нажмите кнопку "Войти"')
    return render_template('login.html')


@application.route('/reg', methods=['POST', 'GET'])
def reg_page():
    key_get = request.args.get('key')
    if key_get:
        try:
            key = Keys.query.filter_by(key=key_get).first()
            if request.method == 'POST':
                login = request.form.get('login')
                password = request.form.get('password1')
                password2 = request.form.get('password2')
                first_name = request.form.get('name')
                last_name = request.form.get('surname')
                patronymic = request.form.get('patronymic')

                if not (login and password and password2 and last_name and patronymic and first_name):
                    flash('Пожалуйста, введите все поля.')
                elif password != password2:
                    flash('Пароли не совпадают')
                else:
                    try:
                        hash_pwd = generate_password_hash(password)
                        new_user = Users(login=login,
                                         permission=key.permission,
                                         password=hash_pwd,
                                         full_name=json.dumps({"first_name": first_name,
                                                               "last_name": last_name,
                                                               "patronymic": patronymic},
                                                              ensure_ascii=False))
                        db.session.add(new_user)
                        db.session.delete(key)
                        db.session.commit()
                        return redirect(url_for('login_page'))
                    except:
                        flash('Такой пользователь уже существует')
            return render_template('reg.html')
        except:
            return redirect(url_for('login_page'))
    else:
        return redirect(url_for('login_page'))