---
layout: post
title: Flask
image: img/flask.png
author: [Soohwan Kim]
date: 2021-12-01T10:00:00.000Z
tags: [toolkit, web, python, open-source]
draft: false
---

## Flask

- Flask는 'micro'웹 프레임워크입니다.
- 즉 Django와 달리 최소한의 구성 요소와 요구 사항을 제공하기 때문에 시작하기 쉽고 필요에 따라 유연하게 사용할 수 있습니다.
- 하지만 완전한 기능을 갖춘 앱을 만들기에 제약이 있다는 뜻은 아니고 오히려 쉽게 확장할 수 있도록 설계되어 있습니다.

### install
`pip install flask`


### Hello Flask
```python
from flask import Flask
app = Flask(__name__)  # Flask 객체 생성
 
@app.route('/')
def index():
    return '<h1>Hello World!</h1>'
 
if __name__ == "__main__":
    app.run(debug=True, port=5000)
```
Flask를 처음 시작할 때 생성하는 hello world 출력 코드입니다.

정말 간단한 코드지만 Flask의 기본적인 구조를 잘 보여주고 있습니다.

app은 Flask객체입니다. 원하는 기능을 추가하고 싶을 때 이 app에 기능을 추가해주면되고, 특정 url에 기능을 추가하고 싶을 경우에도 app을 기준으로 url을 추가해준 뒤 기능을 구현해주면 됩니다.


아무튼 이렇게 실행을 하면 `app.run()`을 통해 `http://127.0.0.1:5000/` 주소로 app이 배포가 시작됩니다.

5000번 port는 flask에서 실행한 서버의 포트이며, `debug=True` 개발용으로 실행한다는 뜻으로 프로젝트에서 변경된 코드가 생길 시 자동으로 변경된 코드를 적용해서 서버를 다시 시작해주는 기능을 갖고 있습니다.

<br>

### Route
Flask를 사용시 어쩌면 가장 중요하다고 할 수 있는 route기능입니다.

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
@app.route('/home')
def home():
    return 'Hello, World!'

@app.route('/user')
def user():
    return 'Hello, User!'

if __name__ == '__main__':
    app.run(debug=True)
```
route는 말 그대로 경로를 지정해주는 기능입니다.

이게 무슨말이냐. 보통 웹에 배포를 시작할 경우 다양한 기능들(로그인, 검색, 메뉴 등등)을 제공해야 하는데 `http://127.0.0.1:5000/` 이라는 주소 하나만으로는 모든 기능을 처리할 수 없습니다.
그렇다고 저 주소안에 여러기능들을 다 쑤셔넣을 수도 없으니까요.

이 `app.route` 데코레이터를 이용해 url의 suffix를 추가해줄 수 있습니다.

위에 코드를 예시로 들어보면 home 함수에는 `/home`, `/`이라는 문자가 route 데코레이터를 통해 추가된 것을 확인할 수 있습니다.

이 말은 `http://127.0.0.1:5000/` 또는 `http://127.0.0.1:5000/home` 에 접속할 경우 home 함수를 실행하라는 뜻입니다.

마찬가지로 `http://127.0.0.1:5000/user` 에 접속 시 user함수가 실행되는 것을 알 수 있습니다.

<br>

### Blueprint
굉장히 중요한 기능인 이 route는 기능이 필요할 때마다 계속 추가되어야 하기 때문에, 함수가 많을 경우 번거로워질 수 있습니다.

예를 들면 동일하게 `/menu` 로 시작하는 url이 있는 경우 2~3개면 상관없겠지만 실제 프로젝트에선 10개가 넘어갈 수도 있는데 전부 하나씩 menu를 달아주는 것은 비효율적입니다.

이런 상황에서 blueprint를 이용하면 route함수들을 보다 구조적으로 관리할 수 있게 됩니다.

### Blueprint 객체
```python
# app.py
from flask import Flask

app = Flask(__name__)

from .views import main_views	
app.register_blueprint(main_views.bp)
```

```python
# views\main_views.py
from flask import Blueprint

bp = Blueprint('main_views', __name__, url_prefix='/view')


@bp.route('/hello')
def main_view():
    return 'main view'
```

1. blueprint 객체 생성
2. Flask 객체 app에서 blueprint객체를 register해준다.
3. controller route에서 blueprint 객체를 써준다.

최종적으로 hello_pybo함수의 url은 `127.0.0.1:5000/view/hello`가 됩니다.

이런 식으로 blueprint를 사용하여 url을 구조적으로 관리해줄 수 있습니다.

### app teardown appcontext
```python
@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()
```
`app.teardown_appcontext`데코레이터는 클라이언트의 요청이 종료됐을 경우에 자동으로 실행되도록 하는 함수입니다.

위 함수를 읽기만해도 알 수 있듯이 클라이언트의 요청이 종료될 경우 해당함수가 실행돼 db가 종료되도록 한다는 뜻입니다.

매우 간단하지만 중요한 개념이기 때문에 언급하고 넘어가겠습니다.


## Database
이번엔 flask에 database를 연동하는 방법을 알아보겠습니다.

흔히들 python에 database에 연동할 때 각 sql을 지원하는 라이브러리의 connect()함수를 사용하여 연동했을겁니다.

```python
# ex) mysql 연결
import pymysql 

conn = pymysql.connect(
    user='root', 
    passwd='{설정한 비밀번호}', 
    host='127.0.0.1', 
    db='juso-db', 
    charset='utf8'
)
```
이런 식으로 간단하게 연동한 뒤 원하는 sql명령을 처리해 db에 적용했습니다.

하지만 flask는 보통 배포를 위해 사용되고 또한 배포되는 서버는 다수의 사용자가 사용하게 됩니다. 위와 같은 방식으로 구현한다면 1만명의 사용자가 접속했을 때 1만번의 db연결을 해줘야 됩니다.

즉 매우매우 비효율적이고, 속도도 느립니다.

이를 해결하기 위해 미리 db session을 저장해두는 pooling방식을 사용합니다. 

### flask-sqlalchemy
하지만 저희가 굳이 pooling을 구현할 필요는 없습니다. 이미 pooling방식으로 간단하게 데이터베이스를 연동할 수 있는 sqlalchemy 라이브러리가 존재하고,

더 나아가 flask를 위해 구현되어 편리하게 app객체에 db옵션을 추가해줄 수 있고, 클라이언트 요청이 종료되면 자동으로 db_session을 pool에서 삭제시켜주기까지 하는
flask-sqlalchemy라는 라이브러리가 존재합니다.

### config
https://flask-sqlalchemy.palletsprojects.com/en/2.x/config/#configuration-keys

flask-sqlalchemy 라이브러리를 사용하면 flask 객체에 sqlalchemy에 대한 설정을 해줄 수 있습니다.

전체 config속성은 위 링크에 접속하셔서 확인해주시면 되고, 그 중 중요하다고 생각되는 기능들을 알아보겠습니다.
```python
from flask import Flask

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://{user_name}:{password}@{host}:{port}/{database_name}"
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
app.config['SQLALCHEMY_POOL_SIZE'] = 30
app.config['SQLALCHEMY_MAX_OVERFLOW'] = 20
app.config['SQLALCHEMY_POOL_RECYCLE'] = 60
```
사용법은 간단합니다. 생성된 flask객체의 config함수에서 원하는 속성값을 지정해주면 됩니다.

- `SQLALCHEMY_DATABASE_URI`: 연결에 사용되는 데이터베이스 URI (어떤 sql을 사용하느냐에 따라 주소의 형태가 다릅니다.)
- `SQLALCHEMY_COMMIT_ON_TEARDOWN`: 클라이언트의 request 마지막단에서 데이터베이스의 변경사항을 자동으로 커밋하는 기능
- `SQLALCHEMY_POOL_SIZE`: pool 크기를 지정합니다.
- `SQLALCHEMY_MAX_OVERFLOW`: pool overflow 크기를 지정합니다.
- `SQLALCHEMY_POOL_RECYCLE`: pool에 존재하는 session이 자동으로 recycle되는 시간을 지정합니다.

### db연결
```python
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

db.init_app(app)
```
flask_sqlalchemy의 SQLAlchemy 클래스 객체를 생성해주고 init_app을 앞서 설정했던 flask app과 연결해주면 매우 쉽게 연동이 완료됩니다.

자 이제 SQLAlchemy를 이용해 새로운 table을 생성해보겠습니다.

```python
class Test(db.Model):
    __tablename__ = 'test'
    user_id = db.Column(db.String(20), primary_key=True)
    name = db.Column(db.String(20))
    
    def __init__(self, user_id, name):
        self.user_id = user_id
        self.name = name
```

db.Model 클래스를 상속받는 Test라는 클래스를 생성해봤습니다.

이 Test클래스는 하나의 table입니다. 

`__tablename__`: 이름에서 알 수 있듯이 테이블명입니다.

`user_id = db.Column(db.String(20), primary_key=True)`: user_id라는 컬럼을 만드는데 String type에 길이는 20이며, primary_key로 지정하겠다는 의미입니다.

이런 식으로 원하는 테이블과 column들을 원하는 대로 만들어줄 수 있으며 자유롭게 코드 내부에서 객체로 생성해 사용가능합니다. 

다만 실제로 sql내부에 생성하려면 별도의 작업이 필요합니다.

아까 db를 연결했던 코드에서 단 한줄만 추가해주면 됩니다.
```python
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

db.init_app(app)
db.create_all()
```
`db.create_all()`을 사용하면 db.Model을 상속받은 클래스들이 실제로 sql내부에 존재하는지 여부를 확인하고 존재한다면 자동으로 생성해줍니다.

### 기본적인 db응용

SELECT
```python
db.session.query(Test).all() #SELECT * FROM test
db.session.query(Test.user_id).all() #SELECT user_id FROM test
```
WHERE
`filter`를 사용합니다.
```python
db.session.query(Test).filter(Test.user_id == 'sooftware').all()
db.session.query(Test).filter(Test.user_id == 'sooftware', Test.name == 'Soohwan Kim').all() 
```

INSERT
```python
test = Test('sooftware', 'Soohwan Kim')
db.session.add(test)
db.session.commit()
```

sql에 대해 자세히 모르더라도 객체의 함수로 편리하고 쉽게 처리가 가능합니다.
