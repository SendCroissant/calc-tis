'use strict';

const head = ['№ АТС', '1', '2', '3', '4', '5', '6', '7', 'BBC', 'АМТС', 'Σ Yi-j'];
const labels = ['1', '2', '3', '4', '5', '6', '7', 'АМТС', 'Σ Yi-j'];

var _ = require('lodash');
var React = require('react');
var TableView = require('./TableView');

function convertData (data) {
  return _.map(data, function (row) {
    return _.map(row, round);
  });
}

function round (number) {
  return Math.round(number * 100) / 100;
}

var InterstationPhoneLoads = React.createClass({

  propTypes: {
    data: React.PropTypes.arrayOf(
      React.PropTypes.arrayOf(
        React.PropTypes.number.isRequired
      ).isRequired
    ).isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    console.warn(this.props.data);
    return (
      <TableView
        title="Табл. 1.4 Матриця міжстанційних телефонних навантажень"
        data={convertData(this.props.data)}
        head={head}
        labels={labels} />
    );
  }

});

module.exports = InterstationPhoneLoads;
