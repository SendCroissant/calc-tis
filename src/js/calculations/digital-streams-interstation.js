'use strict';

var _ = require('lodash');

/**
 * Розрахунок цифрових потоків Е1 між пунктaми введення-виведення
 * @param {array(array)} data
 * @param {object} schema
 * @return {array(array)}
 */
module.exports = function calculateDigitalStreamsInterstation (data, schema) {
  var $ = {};

  _.forEach(schema.ops, function (key, index) {
    $[key] = index;
  });

  $[schema.vss] = 'vss';
  $[schema.amts] = 'amts';

  return _.map(schema.config, function (_row, i) {
    return _.map(schema.config, function (_row, j) {
      if (i === j) return NaN;

      return calc(schema.config[i], schema.config[j], data, $);
    });
  });
};

function calc (from, to, data, $) {
  return _.reduce(from, function (result, i) {
    i = $[i];
    if (i === 'amts') {
      i = 7;
    } else if (i === 'vss') {
      return result;
    }

    return result + _.reduce(to, function (result, j) {
      j = $[j];
      if (j === 'amts') {
        j = 8;
      } else if (j === 'vss') {
        j = 7;
      }

      return result +  (data[i][j] || 0);
    }, 0);
  }, 0);
}
