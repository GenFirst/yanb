/**
 * Created by vdimitrieski on 17.6.16..
 */

var Post = require('mongoose').model('Post');

//middleware for create
exports.create = function (req, res, next) {
    var post = new Post(req.body);

    post.save(function (err) {
        if (err) {
            next(err);
        } else {
            res.json(post);
        }
    });
};

exports.get = function (req, res, next) {
    Post.find(function (err, posts) {
        if (err) {
            next(err);
        } else {
            res.json(posts);
        }
    });
};

exports.getById = function (req, res, next) {
    Post.findOne
};