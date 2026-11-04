const express = require('express');
const childProcess = require('child_process');
const app = express();

const ALLOWED_COMMANDS = {
  'list': { cmd: '/bin/ls', args: ['-la'] },
  'date': { cmd: '/bin/date', args: [] }
};

app.get('/run', (req, res) => {
  const commandKey = req.query.command;
  const allowedCommand = ALLOWED_COMMANDS[commandKey];
  
  if (!allowedCommand) {
    return res.status(400).send('Invalid command');
  }
  
  childProcess.execFile(allowedCommand.cmd, allowedCommand.args, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send('Command execution failed');
    }
    res.send(stdout);
  });
});
module.exports = app;
