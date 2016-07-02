/**
 * Created by vdimitrieski on 17.6.16..
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var CommentSchema = new Schema({
    body: {type: String, required: true},
    author: {type: String, required: true}
}, {
    timestamps: true
});


mongoose.model('Comment', CommentSchema);