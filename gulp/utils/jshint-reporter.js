var gutil = require('gulp-util');
var table = require('text-table');

module.exports = function jshintReporter(result, config, options) {
	'use strict';

	var total = result.length;
	var ret = '';
	var headers = [];
	var prevfile;

	options = options || {};

	ret += table(result.map(function (el, i) {
		var err = el.error;
		var line = [
			'',
			gutil.colors.yellow('line ' + err.line),
			gutil.colors.yellow('col ' + err.character),
			gutil.colors.red(err.reason)
		];

		if (el.file !== prevfile) {
			headers[i] = el.file;
		}

		if (options.verbose) {
			line.push(gutil.colors.yellow('(' + err.code + ')'));
		}

		prevfile = el.file;

		return line;
	}), {
		stringLength: function (str) {
			return gutil.colors.stripColor(str).length;
		}
	}).split('\n').map(function (el, i) {
		return headers[i] ? '\n' + gutil.colors.magenta.underline(headers[i]) + '\n' + el : el;
	}).join('\n') + '\n\n';

	var sign;
	if (total > 0) {
		sign = process.platform !== 'win32' ? '✖ ' : '';
		ret += gutil.colors.red.bold(sign + total + ' problem' + (total === 1 ? '' : 's'));
	} else {
		sign = process.platform !== 'win32' ? '✔ ' : '';
		ret += gutil.colors.green.bold(sign + 'No problems');
		ret = '\n' + ret.trim();
	}

	console.log(ret + '\n');
};
