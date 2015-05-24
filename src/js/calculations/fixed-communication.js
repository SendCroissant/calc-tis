/**
 * Розрахунок міжстанційних з'єднувальних ліній для фіксованого зв'язку
 */

'use strict';

var _ = require('lodash');
var Erlang = window.AppDataTableErlang.data;

var indexATC = getLoseIndex(0.005);
var indexBCC = getLoseIndex(0.001);
var indexAMTC = getLoseIndex(0.01);

function findErlang (value, loseIndex) {
  for(var key in Erlang.loads) {
    if (Erlang.loads[key][loseIndex] >= value) {
      return key;
    }
  }
  
  return key;
}

function getLoseIndex (p) {
  return _.indexOf(Erlang.losses, p);
}

/**
 * Розрахунок міжстанційних з'єднувальних ліній для фіксованого зв'язку
 * @param {array(array)} data

 * @return {array(array)}
 */
module.exports = function calculateFixedCommunication (data) {
  var result = _.map(data.slice(0, data.length - 2), function (row) {
    var valueBCC = Number(findErlang(row[row.length - 3], indexBCC));
    var valueAMTC = Number(findErlang(row[row.length - 2], indexAMTC));

    row = _.map(row.slice(0, row.length - 3), function (Y) {
      if (isNaN(Y)) return Y;
      return Number(findErlang(Y, indexATC));
    });

    row.push(valueBCC, valueAMTC);
    return row;
  });

  var rowAMTC = data[data.length - 2];

  rowAMTC = _.map(rowAMTC.slice(0, rowAMTC.length - 1), function (Y) {
    if (isNaN(Y)) return Y;
    return Number(findErlang(Y, indexAMTC));
  });

  result.push(rowAMTC);

  return result;
};
