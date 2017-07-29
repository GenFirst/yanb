/**
 * Created by vdimitrieski on 17.6.16..
 */
'use strict';

var superagent = require('superagent'),
    should = require('chai').should();

describe('users', function () {

    var UserModel;

    before(function () {
        UserModel = require('mongoose').model('User');
    });

    describe('#post', function () {

        after(function (done) {
            UserModel.remove({}, function () {
                done();
            });
        });

        it('save a valid user - all fields', function (done) {
            var body = {
                email: 'myemail@gmail.com',
                password: 'password',
                firstName: 'John',
                lastName: 'Doe'
            };
            superagent
                .post('http://localhost:3030/api/v1/users')
                .send(body)
                .end(function (error, result) {
                    result.status.should.equal(200);
                    done();
                });
        });

        it('save a valid user - minimum fields & email trim', function (done) {
            var body = {email: '   myemail2@gmail.com   ', password: 'password'};
            superagent
                .post('http://localhost:3030/api/v1/users')
                .send(body)
                .end(function (error, result) {
                    result.status.should.equal(200);
                    result.body.email.should.equal(body.email.trim());
                    done();
                });
        });

        it('fail to save - duplicate email', function (done) {
            var body = {email: 'myemail3@gmail.com', password: 'password'};
            var user = new UserModel(body);
            user.save(function (err, p) {
                user = p;
                superagent
                    .post('http://localhost:3030/api/v1/users')
                    .send(body)
                    .end(function (error, result) {
                        result.status.should.equal(500);
                        done();
                    });
            });
        });

        it('fail to save - invalid email', function (done) {
            var body = {email: 'myemail2gmail.com', password: 'password'};
            superagent
                .post('http://localhost:3030/api/v1/users')
                .send(body)
                .end(function (error, result) {
                    result.status.should.equal(500);
                    done();
                });
        });

        it('fail to save - invalid password', function (done) {
            var body = {email: 'myemail2@gmail.com', password: 'passw'};
            superagent
                .post('http://localhost:3030/api/v1/users')
                .send(body)
                .end(function (error, result) {
                    result.status.should.equal(500);
                    done();
                });
        });

        it('fail to save - missing password', function (done) {
            var body = {email: 'myemail2@gmail.com'};
            superagent
                .post('http://localhost:3030/api/v1/users')
                .send(body)
                .end(function (error, result) {
                    result.status.should.equal(500);
                    done();
                });
        });

        it('fail to save - missing email', function (done) {
            var body = {password: 'password'};
            superagent
                .post('http://localhost:3030/api/v1/users')
                .send(body)
                .end(function (error, result) {
                    result.status.should.equal(500);
                    done();
                });
        });

    });

    describe('#update', function () {
        var user;
        //save one user to a database
        before(function (done) {
            user = new UserModel({
                email: 'myemail@gmail.com',
                password: 'password',
                firstName: 'John',
                lastName: 'Doe'
            });
            user.save(function (err, usr) {
                user = usr;
                done();
            });
        });

        //cleanup the database
        after(function (done) {
            UserModel.remove({}, function () {
                done();
            });
        });

        it('update user', function (done) {
            var userClone = {
                firstName: 'UPDATED',
                _id: user.id
            };
            superagent
                .put('http://localhost:3030/api/v1/users/' + user.id)
                .send(userClone)
                .end(function (error, result) {
                    result.status.should.equal(200);
                    result.body.email.should.equal(user.email);
                    result.body.firstName.should.equal('UPDATED');
                    done();
                });
        });

        it('fail to update - user does not exist', function (done) {
            superagent
                .get('http://localhost:3030/api/v1/users/' + (user.id + 1))
                .end(function (error, result) {
                    result.status.should.equal(500);
                    done();
                });
        });
    });

    describe('#delete', function () {
        var user;
        before(function (done) {
            user = new UserModel({
                email: 'myemail@gmail.com',
                password: 'password',
                firstName: 'John',
                lastName: 'Doe'
            });
            user.save(function (err, usr) {
                user = usr;
                done();
            });
        });

        //cleanup the database
        after(function (done) {
            UserModel.remove({}, function () {
                done();
            });
        });

        it('delete user', function (done) {
            superagent
                .put('http://localhost:3030/api/v1/users/' + user.id)
                .send(user)
                .end(function (error, result) {
                    result.status.should.equal(200);
                    result.body._id.should.equal(user.id);
                    done();
                });
        });

        it('fail to delete - user does not exist', function (done) {
            superagent
                .get('http://localhost:3030/api/v1/users/' + (user.id + 1))
                .end(function (error, result) {
                    result.status.should.equal(500);
                    done();
                });
        });
    });

    describe('#get', function () {
        var user;
        before(function (done) {
            user = new UserModel({
                email: 'myemail@gmail.com',
                password: 'password',
                firstName: 'John',
                lastName: 'Doe'
            });
            user.save(function (err, usr) {
                user = usr;
                done();
            });
        });

        //cleanup the database
        after(function (done) {
            UserModel.remove({}, function () {
                done();
            });
        });

        it('get all valid users', function (done) {
            superagent
                .get('http://localhost:3030/api/v1/users')
                .end(function (error, result) {
                    result.status.should.equal(200);
                    result.body.should.have.length(1);
                    done();
                });
        });

        it('get user by id', function (done) {
            superagent
                .get('http://localhost:3030/api/v1/users/' + user.id)
                .end(function (error, result) {
                    result.status.should.equal(200);
                    should.exist(result.body._id);
                    done();
                });
        });

        it('get user by id - wrong id', function (done) {
            superagent
                .get('http://localhost:3030/api/v1/users/' + (user.id + 1))
                .end(function (error, result) {
                    result.status.should.equal(500);
                    done();
                });
        });

    });

});