/* global console */

var through = require('through2');
var gutil = require('gulp-util');

module.exports = function filelog (taskParam) {
	'use strict';

	var count = 0;

	function decorate (color, text) {
		return text.toString ? gutil.colors[color](text.toString()) : '';
	}

	return through.obj(function (file, enc, callback) {
		var items = [];
		count++;

		items.push('[');
		if (taskParam) {
			items.push(decorate('green', taskParam));
		}
		items.push(decorate('yellow', count));
		items.push(']');
		items.push(decorate('cyan', file.path));
		if (file.isNull()) {
			items.push(decorate('magenta', 'EMPTY'));
		}

		console.log(items.join(' '));

		this.push(file);
		return callback();
	}, function (callback) {
		var width = 40;
		var task = taskParam ? ' [' + taskParam + '] ' : '';
		var l = task.length;

		if (l > width - 2) {
			width = l + 2;
		}
		var diffL = width - l;
		var preL = Math.floor(diffL / 2);
		var postL = diffL - preL;

		var head = decorate(
				'green',
				'\n' + new Array(preL + 1).join('-') + task + new Array(postL + 1).join('-') + '\n'
			);
		var content = 'Passed ' + decorate('yellow', count) + ' files.';

		l = gutil.colors.stripColor(content).length;
		diffL = width - l;
		preL = Math.floor(diffL / 2);

		content = new Array(preL + 1).join(' ') + content + '\n';

		var foot = decorate('green', new Array(width + 1).join('-') + '\n');
		console.log(head +  content + foot);
		return callback();
	});
};
