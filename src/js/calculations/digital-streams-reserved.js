'use strict';

var _ = require('lodash');

/**
 * Розрахунок цифрових потоків всех Е1 с 30% запасом
 * @param {array(array)} data
 * @return {array(array)}
 */
module.exports = function calculateDigitalStreamsReserved (data) {
  return _.map(data, function (row) {
    return _.map(row, function (item) {
        return Math.ceil(item * 1.3);
    });
  });
};
