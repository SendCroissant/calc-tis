'use strict';

const PATH_DIST = 'dist';
const PATH_LIB = 'lib';
const PATH_LIB_ALL = PATH_LIB + '/**';
const PATH_SRC = 'src';
const PATH_SRC_ALL = PATH_SRC + '/**';
const PATH_LIB_ALL_JS = PATH_LIB_ALL + '/*.js';
const PATH_LIB_ALL_COPY = PATH_LIB_ALL + '/*.html';
const PATH_GULP_ALL = [
  'gulpfile.js',
  'gulp/**'
];
const PATH_WATCH_FOR_COMPILE = [
  PATH_SRC_ALL
];
const PATH_WATCH_FOR_REBUNDLE = [
  PATH_LIB_ALL_JS
];
const PATH_LINT = PATH_LIB_ALL_JS;

const browserifyOpts = {
  entries: ['./lib/js/index.js'],
  debug: true
};

var _ = require('lodash');
var argv = require('yargs').argv;
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var cache = require('gulp-cached');
var del = require('del');
// var filelog = require('./utils/gulp-filelog-edit');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var jshintReporter = require('./utils/jshint-reporter');
var merge = require('merge-stream');
var react = require('gulp-react');
var Readable = require('stream').Readable;
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var spawn = require('child_process').spawn;
var filterEmptyDirs = require('./utils/filter-empty-directories');

function bundleTask (done) {
  var bowserifyStream = browserify(browserifyOpts)
    .bundle()
    .pipe(source('js/app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        // .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'));

  var copyStream = gulp.src(PATH_LIB_ALL_COPY)
    .pipe(filterEmptyDirs())
    .pipe(cache('bundle-copy'));

  var resultStream = merge(bowserifyStream, copyStream)
    .pipe(gulp.dest(PATH_DIST));

  if (typeof done === 'function') {
    resultStream.on('end', function () {
      logMessage('Build complete\n');
      done();
    });
  } else {
    return resultStream;
  }
}

function compileTask () {
  return gulp.src(PATH_SRC_ALL)
    .pipe(filterEmptyDirs())
    // .pipe(filelog('compile'))
    .pipe(cache('compile'))
    .pipe(gulpif('*.jsx', react()))
    .pipe(gulp.dest(PATH_LIB));
}

function fileStream (filename, contents) {
  var stream = Readable({ objectMode: true });
  stream._read = function () {
    var file = new gutil.File({
      cwd: '',
      base: '',
      path: filename,
      contents: new Buffer(contents || '')
    });
    this.push(file);
    this.push(null);
  };
  return stream;
}

function gulpReloadTask () {
  var p;
  var task = argv.task || 'default';

  return function spawnChildren(done) {
    // kill previous spawned process
    if(p) { p.kill(); }

    // `spawn` a child `gulp` process linked to the parent `stdio`
    p = spawn('node', ['--harmony', 'node_modules/.bin/gulp', task], {stdio: 'inherit'});
    logMessage('Gulp task "' + task + '" restarted!\n');
    done();
  };
}

function lintGulpTask () {
  return gulp.src(PATH_GULP_ALL)
    .pipe(cache('lint-gulp'))
    .pipe(jshint())
    .pipe(jshint.reporter(jshintReporter));
}

function lintSourceTask () {
  return gulp.src(PATH_LINT)
    .pipe(cache('lint-source'))
    // .pipe(filelog('lint-source'))
    .pipe(jshint())
    .pipe(jshint.reporter(jshintReporter));
}

function logMessage (message) {
  setImmediate(function () {
    gutil.log(message);
  });
}

function refreshDirectory (directories) {
  var refreshed = false;

  return function (done) {
    if (refreshed) {
      return done();
    }

    del(directories, function() {
      var caution = [
        'Don\'t change files in this directory.',
        'This directory is generated by gulp from other (source) directories.',
        'After project building your changes in this folder will be lost!'
      ].join('\n');

      var stream = fileStream('!!! CAUTION !!!', caution);

      if (Array.isArray(directories)) {
        _.forEach(directories, function (directory) {
          stream.pipe(gulp.dest(directory));
        });
      } else {
        stream.pipe(gulp.dest(directories));
      }

      stream.on('end', done);

      refreshed = true;
    });
  };
}

function watchForCompile () {
  gulp.watch(PATH_WATCH_FOR_COMPILE, ['lint-source']);
}

function watchForRebundle (done) {
  bundleTask(function () {
    gulp.watch(PATH_WATCH_FOR_REBUNDLE, bundleTask);
    done();
  });
}

function watchGulpReloadTask () {
  gulp.watch(PATH_GULP_ALL, ['gulp-reload']);
}

gulp.task('build', ['bundle']);
gulp.task('bundle', ['lint-source'], bundleTask);
gulp.task('clean', refreshDirectory([PATH_LIB, PATH_DIST]));
gulp.task('compile', ['clean'], compileTask);
gulp.task('default', ['watch-for-rebundle']);
gulp.task('autoreload', ['gulp-reload'], watchGulpReloadTask);
gulp.task('gulp-reload', ['lint-gulp'], gulpReloadTask());
gulp.task('lint-gulp', lintGulpTask);
gulp.task('lint-source', ['compile'], lintSourceTask);
gulp.task('watch-for-compile', ['lint-source'], watchForCompile);
gulp.task('watch-for-rebundle', ['watch-for-compile'], watchForRebundle);
