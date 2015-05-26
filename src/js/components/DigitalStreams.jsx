'use strict';

const head = ['№ АТС', '1', '2', '3', '4', '5', '6', '7', 'BBC', 'АМТС'];
const labels = ['1', '2', '3', '4', '5', '6', '7', 'АМТС'];

var React = require('react');
var TableView = require('./TableView');

var DigitalStreams = React.createClass({

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
    return (
      <TableView
        title="Матриця цифрових потоків Е1 для ТЛФ фиксир. и мобильн."
        data={this.props.data}
        head={head}
        labels={labels} />
    );
  }

});

module.exports = DigitalStreams;
