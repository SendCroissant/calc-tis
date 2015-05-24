'use strict';

const head = ['№ АТС', 'Y', 'Yвих', 'Yвсс', 'Yззл', 'Yзлм', 'Kвн', 'Yвн', 'Yнадх'];

var _ = require('lodash');
var React = require('react');
var TableView = require('./TableView');

var ReactArrayOfNumbers = React.PropTypes.arrayOf(React.PropTypes.number);

function convertData (data) {
  return _.map(data[head[1]], function ($, index) {
    return _.map(head.slice(1), function (key) {
      return round(data[key][index]);
    });
  });
}

function round (number) {
  return Math.round(number * 100) / 100;
}

var LoadIntensities = React.createClass({

  propTypes: {
    data: React.PropTypes.shape({
      Y    : ReactArrayOfNumbers.isRequired,
      Yвих : ReactArrayOfNumbers.isRequired,
      Yвсс : ReactArrayOfNumbers.isRequired,
      Yззл : ReactArrayOfNumbers.isRequired,
      Yзлм : ReactArrayOfNumbers.isRequired,
      Kвн  : ReactArrayOfNumbers.isRequired,
      Yвн  : ReactArrayOfNumbers.isRequired,
      Yнадх: ReactArrayOfNumbers.isRequired
    }).isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    var data = convertData(this.props.data);
    var labels = _.range(1, data.length + 1);

    return (
      <TableView
        title="Результaти розрaхунків міжcтaнційної інтенcивноcті нaвaнтaження"
        data={data}
        head={head}
        labels={labels} />
    );
  }

});

module.exports = LoadIntensities;
