import hashlib
import os
import pickle
import sqlite3
import subprocess

import yaml
from flask import Flask, request, render_template_string

app = Flask(__name__)


@app.route("/user")
def get_user():
    conn = sqlite3.connect("app.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE name = '%s'" % request.args.get("name"))
    return str(cursor.fetchall())


@app.route("/run")
def run():
    return subprocess.check_output("ls " + request.args.get("dir"), shell=True)


@app.route("/system")
def system():
    os.system("echo " + request.args.get("msg"))
    return "ok"


@app.route("/load", methods=["POST"])
def load():
    return str(pickle.loads(request.data))


@app.route("/config", methods=["POST"])
def config():
    return str(yaml.load(request.data))


@app.route("/hello")
def hello():
    return render_template_string("Hello " + request.args.get("name"))


@app.route("/eval")
def evaluate():
    return str(eval(request.args.get("expr")))


@app.route("/read")
def read():
    with open("/var/data/" + request.args.get("file")) as f:
        return f.read()


def hash_password(password):
    return hashlib.md5(password.encode()).hexdigest()


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
