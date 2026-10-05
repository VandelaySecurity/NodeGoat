const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql");
const serialize = require("node-serialize");

const app = express();
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({ host: "localhost", user: "root", password: "changeme", database: "app" });

app.get("/user", (req, res) => {
  const query = "SELECT * FROM users WHERE id = '" + req.query.id + "'";
  db.query(query, (err, rows) => res.json(rows));
});

app.get("/ping", (req, res) => {
  exec("ping -c 1 " + req.query.host, (err, stdout) => res.send(stdout));
});

app.get("/file", (req, res) => {
  const filePath = path.join(__dirname, "files", req.query.name);
  res.send(fs.readFileSync(filePath, "utf8"));
});

app.get("/greet", (req, res) => {
  res.send("<h1>Hello " + req.query.name + "</h1>");
});

app.post("/calc", (req, res) => {
  res.send(String(eval(req.body.expression)));
});

app.post("/profile", (req, res) => {
  const profile = serialize.unserialize(Buffer.from(req.cookies.profile, "base64").toString());
  res.json(profile);
});

app.get("/redirect", (req, res) => {
  res.redirect(req.query.url);
});

app.get("/regex", (req, res) => {
  const re = new RegExp(req.query.pattern);
  res.send(String(re.test(req.query.input)));
});

app.listen(3000);
