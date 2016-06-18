/**
 * Created by vdimitrieski on 18.6.16..
 */
'use strict';

var db, server;

before(function () {
    process.env.NODE_ENV = 'test';
    db = require('../../config/mongoose')();
    server = require('../../config/express')().listen(3000);
});

after(function () {
    server.close();
    db.disconnect();
    process.env.NODE_ENV = 'development';
});