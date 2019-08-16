'use strict';

const fs = require('fs')

function registerUser(req, res) {
  let faceBuffer = req.swagger.params.face.value.buffer
  let faceName = req.swagger.params.face.value.originalname
  let newPath = `${__basedir}/faces/${faceName}`

  fs.writeFile(newPath, faceBuffer, err => {
    if (err) {
      throw err
    }

    res.json({message: 'Registration success'})
  })
}

module.exports = {
  registerUser: registerUser
}