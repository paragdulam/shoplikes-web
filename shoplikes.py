from flask import Flask,render_template,request,url_for,jsonify
import os
import json
import requests
import ast



app = Flask(__name__)

@app.route("/")
def index(name=None):
	return render_template("index.html",name=name)


@app.route("/products", methods=['POST'])
def getProductsforLike():
	params = ast.literal_eval(request.data)
	likeId = params['likeId']
	likeName = params['likeName']
	requestURL = 'http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=SapnaSol-b016-439b-ba9f-0a88df89de2e&RESPONSE-DATA-FORMAT=JSON&keywords='+likeName+'&outputSelector(0)=galleryPlusPictureURL&itemFilter(0).name=ListingType&itemFilter(0).value=FixedPrice'
	response = requests.get(requestURL).content
	retval = {'likeId':likeId, 'likeName':likeName, 'results':response}
	return jsonify(retval)




if __name__ == '__main__':
	 # Bind to PORT if defined, otherwise default to 5000.
    #port = int(os.environ.get('PORT', 5000))
    port = int(os.environ.get('PORT', 33507))
    app.debug = True
    app.run(host='0.0.0.0', port=port)