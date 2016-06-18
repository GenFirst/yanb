/**
 * Created by vdimitrieski on 18.6.16..
 */
'use strict';

var passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('mongoose').model('User');


module.exports = function () {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function (email, password, done) {
        User.findOne({email: email}, '+password +salt', function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Unknown user'
                });
            }
            if (!user.authenticate(password)) {
                return done(null, false, {
                    message: 'Invalid password'
                });
            }
            return done(null, user);
        });
    }));
};