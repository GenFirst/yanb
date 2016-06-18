/**
 * Created by vdimitrieski on 17.6.16..
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TagSchema = new Schema({
    name: {type: String, required: true, maxLength: 140}
});

mongoose.model('Tag', TagSchema);