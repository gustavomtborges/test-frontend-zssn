var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var eslint = require('gulp-eslint');

var paths = {
  jsFiles: ['*.js', 'public/app/**/*.js'],
  cssFiles: ['public/css/**/*.css']
};

gulp.task('lint', function () {
  return gulp.src(paths.jsFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('serve', ['lint'], function () {
  var options = {
    script: 'index.js',
    delayTime: 1,
    env: {
      'PORT': 3000
    },
    watch: [paths.jsFiles, paths.cssFiles]
  };

  return nodemon(options).on('restart', function () {
    console.log('Restarting...');
  });
});