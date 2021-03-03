from pymongo import MongoClient
import jwt

from flask import Flask, render_template, jsonify, request, redirect, url_for

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['UPLOAD_FOLDER'] = "./static/profile_pics"

client = MongoClient('localhost', 27017)
db = client.dbsparta

@app.route('/')
def home():
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




if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)