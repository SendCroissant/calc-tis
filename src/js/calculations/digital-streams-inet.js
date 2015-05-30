'use strict';

const k = 1024 / 2.048;

var _ = require('lodash');

/**
 * Розрахунок цифрових потоків Е1 все ТЛФ + Интернет
 * @param {array(array)} data
 * @param {array} inet
 * @return {array(array)}
 */
module.exports = function calculateDigitalStreamsInet (data, inet) {
  return _.map(data, function (row, index) {
    row = row.slice();

    row[8] = Math.ceil(row[8] + inet[index] * k);

    return row;
  });
};
