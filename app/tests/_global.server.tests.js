/**
 * Created by vdimitrieski on 18.6.16..
 */
'use strict';

var db, server, passport;

before(function () {
    //perform necessary setup for running the server
    process.env.NODE_ENV = 'test';
    db = require('../../config/mongoose')();
    server = require('../../config/express')().listen(3030);
    passport = require('../../config/passport')();
});

after(function () {
    //do the cleanup
    server.close();
    db.disconnect();
    process.env.NODE_ENV = 'development';
});