/**
 * Created by vdimitrieski on 17.6.16..
 */
var router = require('express').Router();
var posts = require('../../app/controllers/posts.server.controller');


router.route('/posts')
    .post(posts.create)
    .get(posts.get);


module.exports = router;