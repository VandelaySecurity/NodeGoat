const express = require('express');
const childProcess = require('child_process');
const app = express();
app.get('/run', (req, res) => {
  childProcess.exec(req.query.command, (error, stdout) => res.send(stdout));
});
module.exports = app;
