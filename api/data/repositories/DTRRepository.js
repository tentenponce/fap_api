'use strict'

const db = require('../DBConnection.js')

const DTR = function(empName = "", 
  timeIn = null,
  timeOut = null,
  logDate = new Date()) {
  this.empName = empName
  this.timeIn = timeIn
  this.timeOut = timeOut
  this.logDate = logDate
}

DTR.create = function(dtr, callback) {
  db.query(`INSERT INTO dtr set ?`, dtr, (err, res) => {
    if (err) {
      throw err
    } else {
      callback(dtr)
    }
  })
}

DTR.getByName = function(empName, callback) {
  db.query('SELECT * FROM dtr WHERE empName = ? ORDER BY logDate DESC', 
    empName, 
    (err, res) => {
      if (err) {
        throw err
      } else {
        callback(res)
      }
  })
}

DTR.get = function(callback) {
  db.query('SELECT * FROM dtr', (err, res) => {
    if (err) {
      throw err
    } else {
      callback(res)
    }
  })
}

DTR.update = function(dtr, callback) {
  db.query('UPDATE dtr SET timeIn = ?, timeOut = ? WHERE empName = ? AND logDate = ?', 
    [dtr.timeIn, dtr.timeOut, dtr.empName, dtr.logDate], 
    (err, res) => {
      if (err) {
        throw err
      } else {
        callback(dtr)
      }
    })
}

module.exports = DTR