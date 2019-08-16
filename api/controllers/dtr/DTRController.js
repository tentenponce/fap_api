'use strict';

const fs = require('fs')
const DTR = require('../../data/repositories/DTRRepository.js')

function logTime(req, res) {
  const empName = req.swagger.params.body.value.empName
  const currentTime = new Date()

  DTR.getByName(empName, logs => {
    if (logs && logs.length > 0) {
      const dateToday = new Date()
      dateToday.setHours(0, 0, 0, 0)

      const log = logs[0]

      // compare log date
      const logDate = new Date(log.logDate.getTime())
      logDate.setHours(0, 0, 0, 0)

      if (logDate.getTime() == dateToday.getTime()) { // if date is same, update time out
        const dtr = new DTR(empName, log.timeIn, currentTime, log.logDate)

        DTR.update(dtr, log => {
          res.json({
            timeIn: log.timeIn,
            timeOut: log.timeOut,
            logDate: log.logDate,
          })
        })
      } else { // else, add new dtr record
        const dtr = new DTR(empName, currentTime)

        DTR.create(dtr, log => {
          res.json({
            timeIn: log.timeIn,
            timeOut: log.timeOut || "",
            logDate: log.logDate,
          })
        })
      }
    } else {
      const dtr = new DTR(empName, currentTime)

      DTR.create(dtr, log => {
        res.json({
          timeIn: log.timeIn,
          timeOut: log.timeOut || "",
          logDate: log.logDate,
        })
      })
    }
  })
}

function getLogs(req, res) {
  DTR.get(logs => {
    res.json(logs)
  })
}

module.exports = {
  logTime,
  getLogs,
}