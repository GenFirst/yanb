/**
 * Created by vdimitrieski on 17.6.16..
 */
'use strict';

var User = require('mongoose').model('User');

//middleware for create
exports.create = function (req, res, next) {
    var user = new User(req.body);

    user.save(function (err) {
        if (err) {
            next(err);
        } else {
            res.json(user);
        }
    });
};

exports.update = function (req, res, next) {
    User.findByIdAndUpdate(req.user._id, req.body, {new: true}, function (err, user) {
        if (err) {
            next(err);
        } else {
            res.json(user);
        }
    });
};

exports.delete = function (req, res, next) {
    req.user.remove(function (err) {
        if (err) {
            next(err);
        } else {
            res.json(req.user);
        }
    });
};

exports.getAll = function (req, res, next) {
    User.find(function (err, users) {
        if (err) {
            next(err);
        } else {
            res.json(users);
        }
    });
};

exports.getOne = function (req, res) {
    res.json(req.user);
};

exports.getById = function (req, res, next, id) {
    User.findOne({_id: id}, function (err, user) {
        if (err) {
            next(err);
        } else {
            req.user = user;
            next();
        }
    });
};