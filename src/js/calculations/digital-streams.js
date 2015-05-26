'use strict';

var _ = require('lodash');

/**
 * Розрахунок цифрових потоків Е1 для ТЛФ фиксир. и мобильн. 
 * @param {array(array)} data
 * @return {array(array)}
 */
module.exports = function calculateDigitalStreams (data) {
  return _.map(data, function (row) {
    return _.map(row, function (item) {
        return Math.ceil(item / 30);
    });
  });
};
