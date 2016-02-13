var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    nodemon = require('gulp-nodemon'),
    watch = require('gulp-watch'),
    gulpif = require('gulp-if'),
    stylus = require('gulp-stylus'),
    cssnano = require('gulp-cssnano'),
    clean = require('gulp-clean'),
    plumber = require('gulp-plumber');

var settings = require('./www/config');

var publicDir = settings.path.www.public;

var isProduction = (process.env.NODE_ENV == 'production');

gulp.task('build-js', function(){
    gulp.src(publicDir("js/**/*.js"))
        .pipe(concat("main.js"))
        .pipe(gulpif(isProduction, uglify()))
        .pipe(gulp.dest(publicDir("build")));
});

gulp.task('build-css', function(){
    gulp.src(publicDir("css/**/*.styl"))
        .pipe(plumber())
        .pipe(stylus())
        .pipe(concat("main.css"))
        .pipe(gulpif(isProduction, cssnano()))
        .pipe(gulp.dest(publicDir("build")));
});

gulp.task('watch-css', function(){
    watch(publicDir('css/**/*.styl'), function(){
        gulp.start('build-css');
    })
});

gulp.task('watch-js', function(){
    watch(publicDir('js/**/*.js'), function(){
        gulp.start('build-js');
    })
});

gulp.task('build', ['build-css', 'build-js']);

gulp.task('clean', function(){
    gulp.src(publicDir('build'), {read: false})
        .pipe(clean());
});

gulp.task('dev', ['build'], function(){

    // Watch all server-side Javascript and restart the server if anything changes
    nodemon({
        script: settings.path.www("app.js"),
        ext: 'js',
        ignore: [publicDir()]
    });

    // Watch client-side JS and CSS and rebuild if they change
    gulp.start('watch-css');
    gulp.start('watch-js');
});
