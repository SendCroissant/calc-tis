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
  var amtsRow = _.map(data[7], function (item, index) {
    return  Math.ceil(item + inet[index] * k);
  });

  data = _.map(data.slice(0, 7), function (row, index) {
    row = row.slice();

    row[8] = Math.ceil(row[8] + inet[index] * k);

    return row;
  });

  data.push(amtsRow);

  return data;
};
