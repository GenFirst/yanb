/**
 * Created by vdimitrieski on 17.6.16..
 */
'use strict';

var router = require('express').Router(),
    passport = require('passport'),
    users = require('../../app/controllers/users.server.controller');

module.exports = function (authenticate) {
    router.route('/auth')
        .post(passport.authenticate('local', {session: false}),
            users.generateToken, users.sendToken);

    router.route('/users')
        .post(authenticate, users.create)
        .get(authenticate, users.getAll);

    router.route('/users/:userId')
        .get(authenticate, users.getOne)
        .put(authenticate, users.update)
        .delete(authenticate, users.delete);

    router.param('userId', users.getById);

    return router;
};