const _ = require("underscore");
const path = require("path");
const util = require('util')

const ALLOWED_ENVIRONMENTS = ["development", "production", "test", "staging"];

const rawEnv = (process.env.NODE_ENV || "development").toLowerCase();
const finalEnv = ALLOWED_ENVIRONMENTS.includes(rawEnv) ? rawEnv : "development";

const allConf = require(path.resolve(__dirname + "/../config/env/all.js"))
const envConf = require(path.resolve(__dirname + "/../config/env/" + finalEnv + ".js")) || {}

const config = { ...allConf, ...envConf }

console.log(`Current Config:`)
console.log(util.inspect(config, false, null))

module.exports = config;
