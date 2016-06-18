/**
 * Created by vdimitrieski on 17.6.16..
 */
'use strict';

var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function () {
    //TODO check if this really works with bluebird
    var db = mongoose.connect(config.db, {promiseLibrary: require('bluebird')});

    //register models and schemas
    require('../app/models/user.server.model');
    //watch out for the order
    require('../app/models/comment.server.model');
    require('../app/models/tag.server.model');
    require('../app/models/post.server.model');

    return db;
};