/**
 * Created by vdimitrieski on 17.6.16..
 */
'use strict';

var superagent = require('superagent'),
    should = require('chai').should();

describe('posts', function () {

    var PostModel;
    var UserModel;
    var user;
    var token;

    before(function (done) {
        PostModel = require('mongoose').model('Post');
        UserModel = require('mongoose').model('User');

        user = new UserModel({
            email: 'myemail@gmail.com',
            password: 'password',
            firstName: 'John',
            lastName: 'Doe'
        });

        user.save(function (err, usr) {

            user = usr;

            var body = {
                email: user.email,
                password: 'password'
            };

            superagent
                .post('http://localhost:3000/api/v1/auth')
                .send(body)
                .end(function (error, result) {
                    token = result.body.token;
                    done();
                });
        });
    });

    after(function (done) {
        PostModel.remove({}, function () {
            UserModel.remove({}, function () {
                done();
            });
        });
    });

    describe('#post', function () {
        it('save a valid post - all fields', function (done) {
            var body = {
                title: 'My First Post',
                body: 'My first body post',
                tags: [{name: 'tech'}, {name: 'nodejs'}],
                comments: [{body: 'A first negative comment', author: 'jdoe'}]
            };
            superagent
                .post('http://localhost:3000/api/v1/posts')
                .send(body)
                .set('Authorization', 'Bearer ' + token)
                .end(function (error, result) {
                    result.status.should.equal(200);
                    result.body.tags.should.have.length(2);
                    result.body.comments.should.have.length(1);
                    result.body.author.should.equal(user.id);
                    done();
                });
        });

        it('save a valid post - minimum fields', function (done) {
            var body = {
                title: 'My First Post',
                body: 'My first body post'
            };
            superagent
                .post('http://localhost:3000/api/v1/posts')
                .send(body)
                .set('Authorization', 'Bearer ' + token)
                .end(function (error, result) {
                    result.status.should.equal(200);
                    done();
                });
        });

        it('fail to save - invalid author', function (done) {
            var body = {
                title: 'My First Post',
                body: 'My first body post',
                author: {_id: (user.id + 1)}
            };
            superagent
                .post('http://localhost:3000/api/v1/posts')
                .send(body)
                .set('Authorization', 'Bearer ' + token)
                .end(function (error, result) {
                    result.status.should.equal(500);
                    done();
                });
        });

        it('fail to save - invalid body', function (done) {
            var body = {title: 'My First Post', body: ''};
            superagent
                .post('http://localhost:3000/api/v1/posts')
                .send(body)
                .set('Authorization', 'Bearer ' + token)
                .end(function (error, result) {
                    should.exist(error);
                    result.status.should.equal(500);
                    done();
                });
        });

        it('fail to save - invalid title', function (done) {
            var body = {title: '', body: 'My first body post'};
            superagent
                .post('http://localhost:3000/api/v1/posts')
                .send(body)
                .set('Authorization', 'Bearer ' + token)
                .end(function (error, result) {
                    should.exist(error);
                    result.status.should.equal(500);
                    done();
                });
        });

        it('fail to save - invalid auth token', function (done) {
            var body = {title: '', body: 'My first body post'};
            superagent
                .post('http://localhost:3000/api/v1/posts')
                .send(body)
                .set('Authorization', 'Bearer ' + token + 'A')
                .end(function (error, result) {
                    should.exist(error);
                    result.status.should.equal(401);
                    done();
                });
        });

        it('fail to save - no auth token', function (done) {
            var body = {title: '', body: 'My first body post'};
            superagent
                .post('http://localhost:3000/api/v1/posts')
                .send(body)
                .end(function (error, result) {
                    should.exist(error);
                    result.status.should.equal(401);
                    done();
                });
        });

    });


    describe('#update', function () {
        var post;

        before(function (done) {

            post = new PostModel({
                title: 'My First Post2',
                body: 'My first body post',
                tags: [{name: 'tech'}, {name: 'nodejs'}],
                comments: [{body: 'A first negative comment', author: 'jdoe'}]
            });
            post.author = user.id;
            console.log(post);
            post.save(function (err, p) {
                post = p;
                console.log(err);
                done();
            });
        });

        //cleanup the database
        after(function (done) {
            PostModel.remove({}, function () {
                done();
            });
        });

        it('update post - basic info', function (done) {
            var postClone = {
                title: 'UPDATED',
                _id: post.id
            };
            superagent
                .put('http://localhost:3000/api/v1/posts/' + postClone._id)
                .send(postClone)
                .set('Authorization', 'Bearer ' + token)
                .end(function (error, result) {
                    result.status.should.equal(200);
                    result.body.title.should.equal(postClone.title);
                    done();
                });
        });

        it('update post - add comment', function (done) {
            var postClone = {
                comments: post.comments,
                _id: post.id
            };
            var newComment = {body: 'A first POSITIVE comment', author: 'jdoe'};
            postClone.comments.push(newComment);
            superagent
                .put('http://localhost:3000/api/v1/posts/' + postClone._id)
                .send(postClone)
                .end(function (error, result) {
                    result.status.should.equal(200);
                    result.body.comments.should.have.length(2);
                    done();
                });
        });

        it('update post - add tag', function (done) {
            var postClone = {
                tags: post.tags,
                _id: post.id
            };
            var newTag = {name: 'newTag'};
            postClone.tags.push(newTag);
            superagent
                .put('http://localhost:3000/api/v1/posts/' + postClone._id)
                .send(postClone)
                .end(function (error, result) {
                    result.status.should.equal(200);
                    result.body.tags.should.have.length(3);
                    done();
                });
        });

        //TODO with business logic
        // it('fail to update - same tag', function (done) {
        //     var postClone = {
        //         tags: post.tags,
        //         _id: post.id
        //     };
        //     var newTag = {name: post.tags[0].name};
        //     postClone.tags.push(newTag);
        //     superagent
        //         .put('http://localhost:3000/api/v1/posts/' + postClone._id)
        //         .send(postClone)
        //         .end(function (error, result) {
        //             result.status.should.equal(500);
        //             done();
        //         });
        // });

        it('fail to update - post does not exist', function (done) {
            superagent
                .get('http://localhost:3000/api/v1/posts/' + (post.id + 1))
                .end(function (error, result) {
                    result.status.should.equal(500);
                    done();
                });
        });
    });

    /*
     describe('#delete', function () {
     var post;
     before(function (done) {
     post = new PostModel({title: 'My First Post', body: 'My first body post'});
     post.save(function (err, p) {
     post = p;
     done();
     });
     });

     //cleanup the database
     after(function (done) {
     PostModel.remove({}, function () {
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
     post = new PostModel({title: 'My First Post', body: 'My first body post'});
     post.save(function (err, p) {
     post = p;
     done();
     });
     });

     //cleanup the database
     after(function (done) {
     PostModel.remove({}, function () {
     done();
     });
     });

     it('get all valid posts', function (done) {
     superagent
     .get('http://localhost:3000/api/v1/posts')
     .end(function (error, result) {
     result.status.should.equal(200);
     result.body.should.have.length(1);
     done();
     });
     });

     it('get post by id', function (done) {
     superagent
     .get('http://localhost:3000/api/v1/posts/' + post._id)
     .end(function (error, result) {
     result.status.should.equal(200);
     should.exist(result.body._id);
     done();
     });
     });

     it('get post by id - wrong id', function (done) {
     superagent
     .get('http://localhost:3000/api/v1/posts/' + (post._id + 1))
     .end(function (error, result) {
     result.status.should.equal(500);
     done();
     });
     });

     });
     */
});