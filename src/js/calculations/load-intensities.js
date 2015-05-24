/**
 * Розрахунок міжстанційної інтенсивності навантаження
 */

'use strict';

var _ = require('lodash');
var calcKвн = require('./relative-load-intensity-coef');

/**
 * Розрахунок інтенсивності навантаження, що надходить на кожній АТС мережі від абонентів
 * @param {array} abons
 * @return {array} Y
 */
function calcY (abons) {
  return _.map(abons, function (item) {
    return item * 1000 * 0.05;
  });
}

/**
 * Розрахунок навантаження на виході комутаційного поля (КП)
 * @param {array} input
 * @return {array} Yвих
 */
function calcYвих (input) {
  return input.slice();
}

/**
 * Розрахунок загального навантаження мережі, що виходить з усіх АТС мережі
 * @param {array} Yвих
 * @return {array} Yвих_мережі
 */
function calcYвих_мережі (Yвих) {
  return _.sum(Yвих);
}

/**
 * Розрахунок частки навантаження на виході кожної i -ї АТС від загального навантаження мережі
 * @param {array} Yвих
 * @return {array} η
 */
function calc_η (Yвих) {
  var Yвих_мережі = calcYвих_мережі(Yвих);

  return _.map(Yвих, function (Yвих_i) {
    return Yвих_i / Yвих_мережі;
  });
}

/**
 * Розрахунок внутрішньостанційного навантаження
 * @param {array} Yвих
 * @param {array} Kвн
 * @return {array} Yвн
 */
function calcYвн (Yвих, Kвн) {
  return _.zipWith(Yвих, Kвн, function (Yвих_i, Kвн_i) {
    return Yвих_i  * Kвн_i / 100;
  });
}

/**
 * Розрахунок навантаження до ВСС (складає до 5 % від вихідного навантаження на i-й АТС)
 * @param {array} Yвих
 * @param {array} Kвн
 * @return {array} Yвсс
 */
function calcYвсс (Yвих) {
  return _.map(Yвих, function (item) {
    return item * 0.05;
  });
}

/**
 * Розрахунок кількості мешканців в місті
 * @param {array} abonents
 * @param {number} citiAbonCoef
 * @return {number} ч.м.
 */
function calcCitizens (abonents, citiAbonCoef) {
  return _.sum(abonents) * citiAbonCoef;
}

/**
 * Розрахунок питомої міжміської інтенсивності навантаження
 * @param {array} citizens
 * @return {number} Am
 */
function calcAm (citizens) {
  if (citizens < 20) return 0.0056;
  if (citizens < 100) return 0.0048;
  if (citizens < 500) return 0.0040;
  if (citizens < 1000) return 0.0032;
  return 0.0024;
}

/**
 * Розрахунок навантаження до АМТС на замовно-з'єднувальні лінії (ЗЗЛ)
 * @param {array} abonents
 * @param {number} Am
 * @return {number} Yззл
 */
function calcYззл (abonents, Am) {
  return _.map(abonents, function (item) {
    return item * Am * 1000;
  });
}

/**
 * Розрахунок навантаження від АМТС до АТС МТМ на з'єднувальні лінії міжміські (ЗЛМ)
 * @param {array} Yззл
 * @return {number} Yзлм
 */
function calcYзлм (Yззл) {
  var coef = 126 / 150;

  return _.map(Yззл, function (item) {
    return item * coef;
  });
}

/**
 * Розрахунок навантаження, що надходить у напрямі інших АТС мережі
 * @param {array} Yвих
 * @param {array} Yвсс
 * @param {array} Yвн
 * @param {array} Yззл
 * @return {number} Yнадх
 */
function calcYнадх (Yвих, Yвсс, Yвн, Yззл) {
  return _.zipWith(Yвих, Yвсс, Yвн, Yззл, function (result, item) {
    return result - item;
  });
}

/**
 * Розрахунок міжстанційної інтенсивності навантаження
 * @param {obect} data
 * @param {array} data.abonents
 * @param {number} data.citiAbonCoef
 * @return {object} {Y, Yвих, Yвсс, Yззл, Yзлм, Kвн, Yвн, Yнадх}
 */
module.exports = function calculateLoadIntensities (data) {
  var Y        = calcY(data.abonents);
  var Yвих     = calcYвих(Y);
  var η        = calc_η(Yвих);
  var Kвн      = _.map(η, calcKвн);
  var Yвн      = calcYвн(Yвих, Kвн);
  var Yвсс     = calcYвсс(Yвих);
  var citizens = calcCitizens(data.abonents, data.citiAbonCoef);
  var Am       = calcAm(citizens);
  var Yззл     = calcYззл(data.abonents, Am);
  var Yзлм     = calcYзлм(Yззл);
  var Yнадх    = calcYнадх(Yвих, Yвсс, Yвн, Yззл);

  return {
    Y    : Y,
    Yвих : Yвих,
    Yвсс : Yвсс,
    Yззл : Yззл,
    Yзлм : Yзлм,
    Kвн  : Kвн,
    Yвн  : Yвн,
    Yнадх: Yнадх
  };
};
