/**
 * Created by vdimitrieski on 17.6.16..
 */
'use strict';

var User = require('mongoose').model('User');

//middleware for create
module.exports.create = function (req, res, next) {
    var user = new User(req.body);

    user.save(function (err) {
        if (err) {
            next(err);
        } else {
            res.json(user);
        }
    });
};

module.exports.update = function (req, res, next) {
    User.findByIdAndUpdate(req.user._id, req.body, {new: true}, function (err, user) {
        if (err) {
            next(err);
        } else {
            res.json(user);
        }
    });
};

module.exports.delete = function (req, res, next) {
    req.user.remove(function (err) {
        if (err) {
            next(err);
        } else {
            res.json(req.user);
        }
    });
};

module.exports.getAll = function (req, res, next) {
    User.find(function (err, users) {
        if (err) {
            next(err);
        } else {
            res.json(users);
        }
    });
};

module.exports.getOne = function (req, res) {
    res.json(req.user);
};

module.exports.getById = function (req, res, next, id) {
    User.findOne({_id: id}, function (err, user) {
        if (err) {
            next(err);
        } else {
            req.user = user;
            next();
        }
    });
};
