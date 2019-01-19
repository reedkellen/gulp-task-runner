'use strict';

const
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  csso = require('gulp-csso'),
  maps = require('gulp-sourcemaps'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  del = require('del'),
  webserver = require('gulp-webserver');

/*
As a developer, I should be able to run the gulp scripts command at the command line to concatenate, minify, and copy all of the project’s JavaScript files into an all.min.js file that is then copied to the dist/scripts folder.
*/
gulp.task('concatJS', function() {
  return gulp.src(['./js/*.js', './js/circle/*.js'])
    .pipe( maps.init() )
    .pipe( concat('all.js') )
    .pipe( maps.write('./') )
    .pipe( gulp.dest('./js/') );
});

gulp.task('scripts', ['concatJS'], function() {
  return gulp.src('./js/all.js')
    .pipe( uglify() )
    .pipe( rename('all.min.js') )
    .pipe( gulp.dest('./dist/scripts/') );
});

/*
As a developer, I should be able to run the gulp styles command at the command line to compile the project’s SCSS files into CSS, then concatenate and minify into an all.min.css file that is then copied to the dist/styles folder.
*/
gulp.task('compileSass', function() {
  return gulp.src(['./sass/*.scss', './sass/**/*.scss'])
    .pipe( maps.init() )
    .pipe( sass() )
    .pipe( maps.write('./') )
    .pipe( gulp.dest('./css/') );
});

gulp.task('styles', ['compileSass'], function() {
  return gulp.src('./css/global.css')
    .pipe( csso() )
    .pipe( rename('all.min.css') )
    .pipe( gulp.dest('./dist/styles/') );
});

/*
As a developer, I should be able to run the gulp images command at the command line to optimize the size of the project’s JPEG and PNG files, and then copy those optimized images to the dist/content folder.
*/
gulp.task('images', function() {
  return gulp.src('./images/*')
    .pipe( imagemin() )
    .pipe( gulp.dest('./dist/content/') );
});

/*
As a developer, I should be able to run the gulp clean command at the command line to delete all of the files and folders in the dist folder.
*/
gulp.task('clean', function() {
  del(['./dist/*']);
});

/*
As a developer, I should be able to run the gulp build command at the command line to run the clean, scripts, styles, and images tasks with confidence that the clean task completes before the other commands.
*/
gulp.task('build', ['clean'], function() {
  gulp.start(['scripts', 'styles', 'images']);
});

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe( webserver({port: 3000, livereload: true}) );
})

gulp.task('default', ['build'], function() {
  gulp.start(['webserver', 'watchSass']);
});

/*
As a developer, when I run the default gulp command, it should continuously watch for changes to any .scss file in my project. When there is a change to one of the .scss files, the gulp styles command is run and the files are compiled, concatenated, and minified to the dist folder. My project should then reload in the browser, displaying the changes.
*/
gulp.task('watchSass', function() {
  gulp.watch(['./sass/**/*.scss', './sass/*.scss'], ['styles']);
});
