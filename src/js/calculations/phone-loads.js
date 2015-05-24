'use strict';

var _ = require('lodash');

/**
 * Розрахунок міжстанційних телефонних навантажень
 * @param {object} data
 * @param {array} data.Yнадх
 * @param {array} data.Yвсс
 * @param {array} data.Yззл
 * @param {array} data.Yзлм

 * @return {array(array)} Yi_j
 */
module.exports = function calculatePhoneLoads (data) {
  var Yнадх_сум = _.sum(data.Yнадх);
  var Yi_j = _.map(data.Yнадх, function (Yнадх_i, i) {
    var row = _.map(data.Yнадх, function (Yнадх_j, j) {
      if (i === j) return NaN;
      return Yнадх_i * Yнадх_j / (Yнадх_сум - Yнадх_i);
    });

    row.push(data.Yвсс[i], data.Yззл[i]);
    row.push(_.sum(row));

    return row;
  });

  var rowAMTS = data.Yзлм.slice();
  rowAMTS.push(NaN, NaN, _.sum(rowAMTS));
  Yi_j.push(rowAMTS);

  var rowSum = _.map(Yi_j[0], function ($, index) {
    if (Yi_j[0].length - 1 === index) return NaN;
    return _.sum(Yi_j, index);
  });
  Yi_j.push(rowSum);

  return Yi_j;
};
