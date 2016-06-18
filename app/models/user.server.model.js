/**
 * Created by vdimitrieski on 17.6.16..
 */
'use strict';

var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({

    firstName: {type: String},
    lastName: {type: String},
    email: {
        type: String, required: true,
        trim: true, unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    //authentication reserved
    password: {
        type: String, required: true,
        minlength: 6, select: false
    },
    salt: {type: String, select: false},
    provider: {
        type: String
        //required: 'Provider is required'
    },
    providerId: String,
    providerData: {}
}, {
    timestamps: true
});

UserSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
}).set(function (fullName) {
    var splitName = fullName.split(' ');
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
});

UserSchema.pre('save', function (next) {
    if (this.password) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

UserSchema.methods.hashPassword = function (password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

UserSchema.methods.authenticate = function (password) {
    return this.password === this.hashPassword(password);
};

UserSchema.set('toJSON', {getters: true, virtuals: true});

mongoose.model('User', UserSchema);