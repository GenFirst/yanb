/**
 * Created by vdimitrieski on 17.6.16..
 */
var posts = require('../../app/controllers/posts.server.controller');

module.exports = function (app) {
    app.route('/posts')
        .post(posts.create)
        .get(posts.get);
};