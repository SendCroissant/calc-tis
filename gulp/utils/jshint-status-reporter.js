var gutil = require('gulp-util');
var map = require('map-stream');
var path = require('path');
var ROOT = path.resolve(__dirname, '../');

module.exports = function jshintStatusReporter () {
	'use strict';

	return map(function (file, cb) {
		// nothing to report or no errors
		var filePath = file.path.split('/');
		var name = filePath.pop();
		var relativePath = path.relative(ROOT, filePath.join('/'));
		var sign, status;

		relativePath = relativePath ? ' [ ' + relativePath + ' ]' : '';

		if (!file.jshint || file.jshint.success) {
			sign = process.platform !== 'win32' ? '✔ ' : '';
			status = gutil.colors.green(sign + 'jshint passed: ');
			relativePath = gutil.colors.yellow(relativePath);
			console.log(status + gutil.colors.cyan(name) + relativePath);
		} else {
			sign = process.platform !== 'win32' ? '✖ ' : '';
			status = gutil.colors.red(sign + 'jshint failed: ');
			console.log(status + gutil.colors.magenta(name) + relativePath);
		}

		return cb(null, file);
	});
};
