/**
 * Created by vdimitrieski on 17.6.16..
 */
'use strict';

var router = require('express').Router();
var users = require('../../app/controllers/users.server.controller');


router.route('/users')
    .post(users.create)
    .get(users.getAll);

router.route('/users/:userId')
    .get(users.getOne)
    .put(users.update)
    .delete(users.delete);

router.param('userId', users.getById);


module.exports = router;