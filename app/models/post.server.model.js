/**
 * Created by vdimitrieski on 17.6.16..
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: {type: String, required: true, maxLength: 140},
    body: {type: String, required: true, minlength: 10}
    //objectid ref
    // author: {type: String}
    //array of comments
    // comments: [type: CategorySchema]
}, {
    timestamps: true
});

mongoose.model('Post', PostSchema);