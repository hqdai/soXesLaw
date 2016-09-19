var gulp  = require('gulp'),
    gutil = require('gulp-util');

var pug = require('gulp-pug');
var puglint = require('gulp-pug-lint');

var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var stream = browserSync.stream;

var config = {
  views: 'source/views/',
  styles: 'source/styles/',
  build: 'static/'
}

gulp.task('browser-sync', function() {
  browserSync({
    server: ['.', 'static'],
    port: 3000
  });
});

gulp.task('clean', function() {
  return del([config.build], {force: true});
});

gulp.task('views', function() {
  return gulp.src([config.views + '**/*.pug', '!' + config.views + 'mixins/**/*.pug', '!' + config.views + 'layouts/**/*.pug'])
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(puglint())
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest(config.build));
});

gulp.task('styles', function() {
  return gulp.src([config.styles + '**/*.css'])
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('style.css'))
    .pipe(gulp.dest(config.build + 'css'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function() {
  gulp.watch(config.styles + '**/*.css', ['styles']);
  gulp.watch(config.views + '**/*.pug', ['views', reload]);
});

gulp.task('build', ['views', 'styles', 'watch', 'browser-sync']);
gulp.task('default', function(){
  runSequence('clean', 'build');
});
gulp.task('release', function(){
  runSequence('clean', 'build');
});
