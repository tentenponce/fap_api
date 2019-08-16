'use strict';

const { registerUser } = require('./register/RegisterController')
const { logTime, getLogs } = require('./dtr/DTRController')

module.exports = {
  registerUser,
  logTime, getLogs,
}