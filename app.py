from pymongo import MongoClient
import jwt
#import datetime
import hashlib
from flask import Flask, render_template, jsonify, request, redirect, url_for, session
from datetime import datetime, timedelta

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['UPLOAD_FOLDER'] = "./static/profile_pics"

# JWT Secret key create
SECRET_KEY = 'SPARTA'

# DB Connection
client = MongoClient('mongodb://test:test@localhost', 27017)
db = client.dbsparta_plus_week4


################# Choidoa ####################
## 2021-03-04                               ##
## Choidoa                                  ##
## 로그인 인증 API                          ##
##############################################

@app.route('/login')
def home():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

        return render_template('/login.html')
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg=""))

# 로그인 페이지 라우팅
@app.route('/login')
def login():
    msg = request.args.get("msg")
    return render_template('login.html', msg=msg)

# 클라이언트가 요청한 데이터를 검증하여 매칭되는 유저 데이터가 있을 경우 토큰을 발행하며, 매칭되는 유저 정보가 없을 경우 토큰을 발행하지 않는다.
@app.route('/sign_in', methods=['POST'])
def sign_in():
    # 클라이언트가 요청한 데이터를 가져와 변수에 담는다.
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']

    # 회원가입시 데이터베이스에 암호화하여 저장되었기 때문에 클라이언트에게 입력받은 패스워드를 암호화하여 변수에 대입한다.
    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    # 클라이언트단에서 전달받은 데이터와 데이터베이스의 데이터를 비교하여 조회된 값을 변수에 대입한다.
    result = db.user.find_one({'username': username_receive, 'password': pw_hash})

    # 데이터베이스에서 조회된 데이터가 있을 경우 조건식은 참이되어 JWT 토큰을 발행한다.
    if result is not None:
        payload = {
            'id': username_receive,
            'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)  # 로그인 24시간 유지
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        # JSON 타입의 HTTP 응답 데이터를 생성하여 return
        return jsonify({'result': 'success', 'token': token})
        render_template('login.html')
    else:
        # 데이터베이스에서 조회된 데이터가 없을 경우 조건식은 거짓이 되어 fail 을 보낸다.
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})



################# ParkJunHee #################
## 2021-03-04                               ##
## ParkJunHee                               ##
## 메인페이지 투두리스트 API                ##
##############################################

@app.route('/api')
def main():
    # memodb에 저장된 data를 전체 찾고 내림차순으로 가지고 온다. 그리고 4개씩만 가져올 수 있기 limit을 설정
    lists = list(db.memo.find({ },{'_id':False}).sort("_id", -1).limit(4))
    # posts에 memodb list data를 담은 lists를 연결한다. 이 posts는 main.html에서 jinja2 engine으로 사용될 예정이다.
    return render_template('main.html', posts = lists)

# API 역할을 하는 부분

@app.route('/api/memo', methods=['POST'])
def insert_memo():
    # main.html에서 input에서 적은 value data를 memo_receive에 담는다.
    memo_receive = request.form['memo_give']
    # userdb를 넣기 전 임시로 id에 값을 넣는다.
    id_receive = "junhee916"
    # doc 안에다 jquery 형식으로 insert할 data를 넣는다.
    doc = {'memo':memo_receive, 'id':id_receive}
    # doc안에 있는 data를 mongodb에 추가한다.
    db.memo.insert_one(doc)
    return jsonify({'msg': 'memo 연결되었습니다!'})

@app.route('/api/delete', methods=['POST'])
def delete_memo():
    # main.html에서 memodata 전달된 memo_give를 memo_receive에 담는다.
    memo_receive = request.form['memo_give']
    # 해당 memodata를 delete 처리한다.
    db.memo.delete_one({'memo': memo_receive})
    return jsonify({'msg': 'delete 연결되었습니다!'})



################# KangMijin ##################
## 2021-03-04                               ##
## KangMijin                                ##
## 회원가입 API                             ##
##############################################

@app.route('/join')
def join():
   return render_template('join.html')

# 회원가입
@app.route('/sign_up/save', methods=['POST'])
def sign_up():
    # 클라이언트단에서 아이디, 비밀번호, 이름을 받아온다.
    userid_receive = request.form['userid_give']
    password_receive = request.form['password_give']
    username_receive = request.form['username_give']

    # 비밀번호는 해시함수로 암호화
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()

    doc = {
        "userid": userid_receive,       # 아이디
        "password": password_hash,      # 비밀번호
        "username": username_receive,   # 이름

    }

    # DB에 해당 데이터를 저장한다.
    db.users.insert_one(doc)

    return jsonify({'result': 'success'})

# 회원가입 시 아이디 중복 확인
@app.route('/sign_up/check_dup', methods=['POST'])
def check_dup():

    # 클라이언트단에서 넘겨받은 아이디를 DB에 조회 -> DB에 해당 id가 존재한다면 true, 조회되지 않는다면 false
    userid_receive = request.form['userid_give']
    exists = bool(db.users.find_one({"userid": userid_receive}))
    return jsonify({'result': 'success', 'exists': exists})
