import os, subprocess, pickle, hashlib, yaml
from flask import request

def run(cmd):
    os.system("ls " + request.args.get("p"))
    subprocess.call(request.args.get("c"), shell=True)
    data = pickle.loads(request.data)
    h = hashlib.md5(b"x").hexdigest()
    cfg = yaml.load(request.data)
    return eval(request.args.get("e"))
