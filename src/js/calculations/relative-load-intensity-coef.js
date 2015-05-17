'use strict';

var data = window.AppDataTableStationLoad.data;

/**
 * Визначення відсотка внутрішньостанційного навантаження Квн від навантаження, що виходить з АТС
 * @param {number} relLoad
 * @return {number} Квн
 */
module.exports = function calcRelativeLoadIntensityCoef (relLoad) {
  var percentage = relLoad * 100;

  if (data[0] === percentage) return data[0][1];

  for (var i = 0, l = data.length - 1; i < l; i++) {
    var curPerc = data[i][0];

    if (curPerc > percentage) {
      return data[i][1];
    }
  }

  return data[data.length - 1][1];
};

// module.exports = function calcRelativeLoadIntensityCoefInterpolated (relLoad) {
//   var percentage = relLoad * 100;
//   var index = null;

//   if (data[0] === percentage) return data[0][1];

//   for (var i = 0, l = data.length - 1; i < l; i++) {
//     var curPerc = data[i][0];
//     var nextPerc = data[i + 1][0];

//     if (nextPerc === percentage) return data[i+1][1];

//     if (curPerc < percentage && percentage < nextPerc) {
//       index = i;
//       break;
//     }
//   }

//   if (index === null) return data[data.length - 1][1];

//   var middle = (percentage - data[index][0]) / (data[index + 1][0] - data[index][0]);

//   return data[index][1] + (data[index + 1][1] - data[index][1]) * middle;
// };
