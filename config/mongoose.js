/**
 * Created by vdimitrieski on 17.6.16..
 */
'use strict';

var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function () {
    var db = mongoose.connect(config.db);

    //register models and schemas
    require('../app/models/post.server.model');

    return db;
};