var map = require('map-stream');

module.exports = function jshintStatusReporter () {
    'use strict';

    return map(function(file, cb) {
        if (file.stat.isFile()) {
            return cb(null, file);
        } else {
            return cb();
        }
    });
};
