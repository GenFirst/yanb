/**
 * Created by vdimitrieski on 17.6.16..
 */
'use strict';

//check the environment variable, development is default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//mongoose file must be loaded before all other files in order to provide
// models to other modules

var mongoose = require('./config/mongoose'),
    express = require('./config/express');

//connect to a database
mongoose();
//start the server
var app = express();

// uncoment this line when application is not started from nodemon
//app.listen(3000);

module.exports = app;

/* eslint-disable no-console */
console.log('Server running at http://localhost:3000/');
/* eslint-enable no-console */
