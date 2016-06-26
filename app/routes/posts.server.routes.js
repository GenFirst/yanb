/**
 * Created by vdimitrieski on 17.6.16..
 */
'use strict';

var router = require('express').Router(),
 posts = require('../../app/controllers/posts.server.controller');

module.exports = function(authenticate){
    router.route('/posts')
        .post(authenticate, posts.create)
        .get(posts.getAll);

    router.route('/posts/:postId')
        .get(posts.getOne)
        .put(authenticate, posts.update)
        .delete(authenticate, posts.delete);

    router.param('postId', posts.getById);

    return router;
};


