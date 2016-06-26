/**
 * Created by vdimitrieski on 17.6.16..
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var PostSchema = new Schema({
    title: {type: String, required: true, maxLength: 140},
    body: {type: String, required: true, minlength: 10},
    author: {type: Schema.ObjectId, ref: 'User', required: true},
    tags: [require('mongoose').model('Tag').schema],
    comments: [require('mongoose').model('Comment').schema]

}, {
    timestamps: true
});

mongoose.model('Post', PostSchema);