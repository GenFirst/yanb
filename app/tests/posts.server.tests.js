/**
 * Created by vdimitrieski on 17.6.16..
 */
'use strict';

var superagent = require('superagent'),
    should = require('chai').should();

describe('posts', function () {
    var server;
    var db;
    var PostSchema;

    //TODO this could be extracted to the module context and done for all mocha tests
    before(function () {
        process.env.NODE_ENV = 'test';
        db = require('../../config/mongoose')();
        server = require('../../config/express')().listen(3000);
        PostSchema = require('mongoose').model('Post');
    });

    after(function () {
        server.close();
        db.disconnect();
    });

    describe('#post', function () {
        //cleanup the database
        after(function (done) {
            PostSchema.remove({}, function () {
                done();
            });
        });

        it('save a valid user', function (done) {
            var body = {title: 'My First Post', body: 'My first body post'};
            superagent
                .post('http://localhost:3000/api/v1/posts')
                .send(body)
                .end(function (error, result) {
                    should.not.exist(error);
                    result.status.should.equal(200);
                    done();
                });
        });

        it('fail to save - empty body', function (done) {
            var body = {title: 'My First Post', body: ''};
            superagent
                .post('http://localhost:3000/api/v1/posts')
                .send(body)
                .end(function (error, result) {
                    should.exist(error);
                    result.status.should.equal(500);
                    done();
                });
        });

        it('fail to save - empty title', function (done) {
            var body = {title: '', body: 'My first body post'};
            superagent
                .post('http://localhost:3000/api/v1/posts')
                .send(body)
                .end(function (error, result) {
                    should.exist(error);
                    result.status.should.equal(500);
                    done();
                });
        });
    });

    describe('#update', function () {
        var post;
        before(function (done) {
            post = new PostSchema({title: 'My First Post', body: 'My first body post'});
            post.save(function (err, p) {
                post = p;
                done();
            });
        });

        //cleanup the database
        after(function (done) {
            PostSchema.remove({}, function () {
                done();
            });
        });

        it('update post', function (done) {
            var postClone = {
                title: 'UPDATED',
                body: post.body,
                _id: post.id
            };
            superagent
                .put('http://localhost:3000/api/v1/posts/' + postClone._id)
                .send(postClone)
                .end(function (error, result) {
                    result.status.should.equal(200);
                    result.body.title.should.equal('UPDATED');
                    done();
                });
        });

        it('fail to update - post does not exist', function (done) {
            superagent
                .get('http://localhost:3000/api/v1/posts/' + (post.id + 1))
                .end(function (error, result) {
                    result.status.should.equal(500);
                    done();
                });
        });
    });

    describe('#delete', function () {
        var post;
        before(function (done) {
            post = new PostSchema({title: 'My First Post', body: 'My first body post'});
            post.save(function (err, p) {
                post = p;
                done();
            });
        });

        //cleanup the database
        after(function (done) {
            PostSchema.remove({}, function () {
                done();
            });
        });

        it('delete post', function (done) {
            superagent
                .put('http://localhost:3000/api/v1/posts/' + post.id)
                .send(post)
                .end(function (error, result) {
                    result.status.should.equal(200);
                    result.body._id.should.equal(post.id);
                    done();
                });
        });

        it('fail to delete - post does not exist', function (done) {
            superagent
                .get('http://localhost:3000/api/v1/posts/' + (post.id + 1))
                .end(function (error, result) {
                    result.status.should.equal(500);
                    done();
                });
        });
    });

    describe('#get', function () {
        var post;
        before(function (done) {
            post = new PostSchema({title: 'My First Post', body: 'My first body post'});
            post.save(function (err, p) {
                post = p;
                done();
            });
        });

        //cleanup the database
        after(function (done) {
            PostSchema.remove({}, function () {
                done();
            });
        });

        it('get all valid users', function (done) {
            superagent
                .get('http://localhost:3000/api/v1/posts')
                .end(function (error, result) {
                    result.status.should.equal(200);
                    result.body.should.have.length(1);
                    done();
                });
        });

        it('get user by id', function (done) {
            superagent
                .get('http://localhost:3000/api/v1/posts/' + post._id)
                .end(function (error, result) {
                    result.status.should.equal(200);
                    should.exist(result.body._id);
                    done();
                });
        });

        it('get user by id - wrong id', function (done) {
            superagent
                .get('http://localhost:3000/api/v1/posts/' + (post._id + 1))
                .end(function (error, result) {
                    result.status.should.equal(500);
                    done();
                });
        });

    });

});