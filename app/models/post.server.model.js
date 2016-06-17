/**
 * Created by vdimitrieski on 17.6.16..
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: {type: String, required: true},
    body: {type: String, required: true}
    //objectid ref
    // author: {type: String}
    //array of comments
    // comments: [type: CategorySchema]
}, {
    timestamps: true
});

mongoose.model('Post', PostSchema);