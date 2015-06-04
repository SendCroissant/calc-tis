'use strict';

/**
 * Розрахунок зaгaльної кількоcті цифрових потоків Е1 нa кожній ділянці кільця
 * @param {array(array)} data

 * @return {array(array)}
 */
module.exports = function calculateDigitalStreamsSegments (data) {
  // VI = V∑A + VD-B + VC-B + VD-C
  // VII = V∑B + VA-C + VD-C + VA-D
  // VIII = V∑C + VA-D + VB-D + VB-A
  // VIV = V∑D + VC-A + VB-A + VC-B

  var result = [];
  var last = data[0].length - 1;

  result[0] = data[0][last] + data[3][1] + data[2][1] + data[3][2];
  result[1] = data[1][last] + data[0][2] + data[3][2] + data[0][3];
  result[2] = data[2][last] + data[0][3] + data[1][3] + data[1][0];
  result[3] = data[3][last] + data[2][0] + data[1][0] + data[2][1];

  return result;
};
