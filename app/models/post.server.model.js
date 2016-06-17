/**
 * Created by vdimitrieski on 17.6.16..
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    created: {type: Date, default: Date.now},
    edited: {type: Date, default: Date.now}
    //objectid ref
    // author: {type: String}
    //array of comments
    // comments: [type: CategorySchema]
});

mongoose.model('Post', PostSchema);