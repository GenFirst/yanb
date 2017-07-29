/**
 * Created by vdimitrieski on 17.6.16..
 */
'use strict';

var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    nodemon = require('gulp-nodemon'),
    eslint = require('gulp-eslint');

//run tests from the appropriate directories
gulp.task('test', function () {
    return gulp.src(['./app/tests/**/*.js'])
        .pipe(mocha()) //{reporter:'dot'}
        .once('error', function (err) {
            console.log(err.toString());
            this.emit('end');
        });
});

//test the quality of the code with ESLint
gulp.task('lint', function () {
    return gulp.src(['**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.formatEach())
        .pipe(eslint.failAfterError());
});

gulp.task('watch', function () {
    gulp.watch('./**/*.js', ['lint']);
});

gulp.task('develop', function () {
  nodemon({script: './bin/www', ext: 'js', legacyWatch: true });
});

gulp.task('default', ['develop']);
