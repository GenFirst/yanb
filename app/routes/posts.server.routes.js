/**
 * Created by vdimitrieski on 17.6.16..
 */
'use strict';

var router = require('express').Router();
var posts = require('../../app/controllers/posts.server.controller');


router.route('/posts')
    .post(posts.create)
    .get(posts.getAll);

router.route('/posts/:postId')
    .get(posts.getOne)
    .put(posts.update)
    .delete(posts.delete);

router.param('postId', posts.getById);


module.exports = router;