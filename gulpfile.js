var gulp = require('gulp'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  notify = require('gulp-notify');

gulp.task('browser-frontend', function() {
  return gulp.src(['./src/core/*.js',
                   './src/frontend/*.js',
                   './src/proxy/proxyClient.js'])
    .pipe(concat('browser-frontend.js'))
    .pipe(gulp.dest('dist/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/'))
    .pipe(notify({ message: 'Done building frontend!' }));
});

gulp.task('proxy', function() {
  return gulp.src(['./src/proxy/*.js',
                   './src/core/*.js'])
    .pipe(concat('proxy.js'))
    .pipe(gulp.dest('dist/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/'))
    .pipe(notify({ message: 'Done building frontend!' }));
});
