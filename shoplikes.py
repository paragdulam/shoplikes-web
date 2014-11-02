from flask import Flask,render_template,request,url_for
import os

app = Flask(__name__)

@app.route("/")
def index(name=None):
	return render_template("index.html",name=name)


if __name__ == '__main__':
	 # Bind to PORT if defined, otherwise default to 5000.
    #port = int(os.environ.get('PORT', 5000))
    port = int(os.environ.get('PORT', 33507))
    app.run(host='0.0.0.0', port=port)