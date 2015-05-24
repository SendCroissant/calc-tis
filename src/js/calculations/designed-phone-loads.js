'use strict';

var _ = require('lodash');

/**
 * Розрахунок розрахункових значень міжстанційних телефонних навантажень
 * @param {array(array)} data

 * @return {array(array)}
 */
module.exports = function calculateDesignedPhoneLoads (data) {
  data = _.map(data.slice(0, data.length - 1), function (row) {
    row = _.map(row.slice(0, row.length - 1), function (Y) {
      return Y + 0.6742 * Math.sqrt(Y);
    });

    row.push(_.sum(row));

    return row;
  });

  var rowSum = _.map(data[0], function ($, index) {
    if (data[0].length - 1 === index) return NaN;
    return _.sum(data, index);
  });

  data.push(rowSum);

  return data;
};
