var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');


gulp.task('dev', function(){
    nodemon({
        script: 'app.js',
        ext: 'js'
    })
});