from flask import Flask, render_template, url_for, request, redirect
from flask_cors import CORS
import requests
from pymongo import MongoClient
import urllib.parse
from bson.json_util import dumps
from datetime import datetime
from flask_httpauth import HTTPBasicAuth

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret key here'
auth = HTTPBasicAuth()

users = {
    "tech_cs": "318!!!!Sol"
}

@auth.get_password
def get_pw(username):
    if username in users:
        return users.get(username)
    return None

CORS(app, origins=["http://localhost:3000", "http://172.21.1.56:3000"])

def ConnectDB():
    username = urllib.parse.quote_plus('admin')
    password = urllib.parse.quote_plus('pass')
    client = MongoClient('mongodb://%s:%s@localhost:28001/board' % (username, password))   
    return client

def GetDB():
    client = ConnectDB()
    co_column_order = client['board']['columnOrder']
    co_column = client['board']['column']
    co_card = client['board']['card']
   
    card_dict = {}
    for i in co_card.find():
        cardid = i['cardid']
        del i['_id']
        card_dict[cardid] = i

    column_dict = {}
    for i in co_column.find():
        columnid = i['columnid']
        del i['_id']
        column_dict[columnid] = i

    order_cursor = co_column_order.find_one()
    
    data = {
        'card': card_dict,
        'column': column_dict,
        'columnOrder':order_cursor["order"]
    }
    return data

def UpdateColOrder(data):
    client = ConnectDB()
    co_column_order = client['board']['columnOrder']
    update = co_column_order.replace_one({},{'order':data['columnOrder']})

def UpdateCardOrder(data):
    client = ConnectDB()
    co_column = client['board']['column']
    for i in data['column']:
        data['column'][i]
        update = co_column.update_one({"columnid":i},{'$set':{'cardIds': data['column'][i]['cardIds']}})
    
def updateGoodCount(data):
    client = ConnectDB()
    co_card = client['board']['card']
    userid = data['userid']
    update = co_card.update_one({"cardid":data['cardid']},{'$addToSet':{'good_list': userid}})
    if update.raw_result['nModified'] == 0:
        update = co_card.update_one({"cardid":data['cardid']},{'$pull':{'good_list': userid}})
    
    newdata = GetDB()
    return newdata

def addCard(data):
    client = ConnectDB()
    co_card = client['board']['card']
    co_column = client['board']['column']
    max_count = co_card.count_documents({})
    new_cardid = "card-" + str(max_count)

    addcard = co_card.insert_one({
        "created_time" : datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "updated_time": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "product" : data['product'],
        "subject" : data['subject'],
        "contents" : data['contents'],
        "cancel_reason" : "",
        "followers" : [],
        "planned_date" : "",
        "good_list": [],
        "cardid": new_cardid,
        })
    updatecolumn = co_column.update_one({"columnid":data['columnid']},{'$addToSet':{'cardIds': new_cardid}})
    newdata = GetDB()
    return newdata


def delCard(cardid):
    client = ConnectDB()
    co_card = client['board']['card']
    co_column = client['board']['column']
    delcard = co_card.delete_one({"cardid":cardid})
    for i in co_column.find():
        if cardid in i['cardIds']:
            updatecolumn = co_column.update_one({"columnid":i['columnid']},{'$pull':{'cardIds': cardid}})
    newdata = GetDB()
    return newdata

def updateCard(data):
    client = ConnectDB()
    co_card = client['board']['card']
    co_column = client['board']['column']
    updatecard = co_card.update_one({"cardid":data['cardid']},{
        '$set':{'product':data['product'], 
                'subject':data['subject'], 
                'contents':data['contents'],
                'updated_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        })
    newdata = GetDB()
    return newdata

def addColumn():
    client = ConnectDB()
    co_column = client['board']['column']
    co_column_order = client['board']['columnOrder']

    max_count = co_column.count_documents({})
    new_columnid = "column-" + str(max_count + 1)

    addcolumn = co_column.insert_one({
        "columnid" : new_columnid,
        "title": "新しい列",
        "cardIds" : []
    })
    update_column_order = co_column_order.update_one({},{'$push':{"order":new_columnid}})
    newdata = GetDB()
    return newdata

def delColumn(data):
    client = ConnectDB()
    co_column = client['board']['column']
    co_column_order = client['board']['columnOrder']

    targetcol = co_column.find_one({"columnid": data['columnid']})
    if len(targetcol['cardIds']) == 0:
        delcol = co_column.delete_one({"columnid": data['columnid']})
        update_column_order = co_column_order.update_one({},{'$pull':{"order":data['columnid']}})
        newdata = GetDB()
    else:
        newdata = "NG"
    return newdata

def updateColumn(data):
    client = ConnectDB()
    co_column = client['board']['column']
    updatecol = co_column.update_one({"columnid":data['columnid']},{'$set':{'title':data['title']}})
    newdata = GetDB()
    return newdata

def searchCard(data):
    client = ConnectDB()
    co_card = client['board']['card']

    result_dict = {}
    for i in co_card.find(filter={'$and':
        [
            {'$or':
                [
                {'contents':{'$regex':data['keyword']}},
                {'subject':{'$regex':data['keyword']}}
                ]
            },
            {'product':
                {'$regex':data['product']}
            }
        ]}):
        cardid = i['cardid']
        del i['_id']
        result_dict[cardid] = i

    for i in co_card.find({'cardid':'card-0'}):
        del i['_id']
        result_dict['card-0'] = i

    newdata = GetDB()
    newdata['card'] = result_dict
    return newdata


@app.route('/')
@auth.login_required
def index():
    return "Hello, %s!" % auth.username()

@app.route('/getCards', methods=["GET"])
@auth.login_required
def get_cards():
    data = GetDB()
    return data

@app.route('/updateColOrder', methods=["POST"])
@auth.login_required
def update_colorder():
    data = request.json
    UpdateColOrder(data)
    return 'OK'

@app.route('/updateCardOrder', methods=["POST"])
@auth.login_required
def update_cardorder():
    data = request.json
    UpdateCardOrder(data)
    return 'OK'

@app.route('/updateGoodCount', methods=["POST"])
@auth.login_required
def update_goodcount():
    data = request.json
    result = updateGoodCount(data)
    return result

@app.route('/addCard', methods=["POST"])
@auth.login_required
def add_card():
    data = request.json
    result = addCard(data)
    return result

@app.route('/delCard/<cardid>', methods=["GET"])
@auth.login_required
def del_card(cardid):
    result = delCard(cardid)
    return result

@app.route('/updateCard', methods=["POST"])
@auth.login_required
def update_card():
    data = request.json
    result = updateCard(data)
    return result

@app.route('/addColumn', methods=["GET"])
@auth.login_required
def add_column():
    result = addColumn()
    return result

@app.route('/delColumn', methods=["POST"])
@auth.login_required
def del_column():
    data = request.json
    result = delColumn(data)
    return result

@app.route('/updateColumn', methods=["POST"])
@auth.login_required
def update_column():
    data = request.json
    result = updateColumn(data)
    return result

@app.route('/searchCard', methods=["POST"])
@auth.login_required
def search_card():
    data = request.json
    result = searchCard(data)
    return result

if __name__ == '__main__':
    app.debug = False
    app.run(host='127.0.0.1',  port=8081)
