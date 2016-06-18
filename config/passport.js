/**
 * Created by vdimitrieski on 18.6.16..
 */
'use strict';

var passport = require('passport'),
    mongoose = require('mongoose');

module.exports = function () {

    require('./strategies/local.js')();
};
