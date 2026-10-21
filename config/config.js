const _ = require("underscore");
const path = require("path");
const util = require('util')

const allowedEnvironments = ["development", "production", "test", "staging"];
const rawEnv = process.env.NODE_ENV || "development";
const finalEnv = allowedEnvironments.includes(rawEnv.toLowerCase()) ? rawEnv : "development";

const allConf = require(path.resolve(__dirname + "/../config/env/all.js"))
const envConf = require(path.resolve(__dirname + "/../config/env/" + finalEnv.toLowerCase() + ".js")) || {}

const config = { ...allConf, ...envConf }

console.log(`Current Config:`)
console.log(util.inspect(config, false, null))

module.exports = config;
