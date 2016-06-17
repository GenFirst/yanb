/**
 * Created by vdimitrieski on 17.6.16..
 */
'use strict';

/***
 * Export configuration based on the environment variable
 */
module.exports = require('./env/' + process.env.NODE_ENV + '.js');