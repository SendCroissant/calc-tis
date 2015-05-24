'use strict';

var _ = require('lodash');

/**
 * Розрахунок міжстанційних з'єднувальних ліній фіксованого і мобільного зв'язку 
 * @param {array(array)} data
 * @return {array(array)}
 */
module.exports = function calculateFixedAndMobileCommunication (data, m2) {
  var k = 1 + m2;

  data = _.map(data, function (row) {
    row = row.slice();
    row[8] = row[8] * k;
    return row;
  });

  data[7] = _.map(data[7], function (item) {
    return item * k;
  });

  return data;
};
