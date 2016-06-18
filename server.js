/**
 * Created by vdimitrieski on 17.6.16..
 */
'use strict';

//check the environment variable, development is default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//mongoose file must be loaded before all other files in order to provide
// models to other modules

var mongoose = require('./config/mongoose'),
    express = require('./config/express'),
    passport = require('./config/passport');


var db = mongoose(); //connect to a database
var app = express(); //start the server
var passport = passport(); //load the passport module


app.listen(3000);

module.exports = app;

console.log('Server running at http://localhost:3000/');