'use strict'

const SwaggerExpress = require('swagger-express-mw')
const app = require('express')()
const cors = require('cors')

global.__basedir = __dirname // add project root path as global

module.exports = app // for testing

var config = {
  appRoot: __dirname // required config
}

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { 
    throw err 
  }

  app.use(cors({
    origin: ['*']
  }))

  // install middleware
  swaggerExpress.register(app)

  var port = process.env.PORT || 10010
  app.listen(port)
});
