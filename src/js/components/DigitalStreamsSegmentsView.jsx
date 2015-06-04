'use strict';

const labels = ['I', 'II', 'III', 'IV'];

var _ = require('lodash');
var React = require('react');

var ReactArrayOf = React.PropTypes.arrayOf;
var ReactNumber = React.PropTypes.number;

var DigitalStreamsSegmentsView = React.createClass({

  propTypes: {
    data: ReactArrayOf(ReactNumber.isRequired).isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    var data = this.props.data;
    var heads = [];
    var values = [];

    _.forEach(labels, function (label, index) {
      heads.push(<th className="text-center" key={index}>{label}</th>);
      values.push(<td className="text-center" key={index}>{data[index]}</td>);
    });

    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          Зaгaльнa кількіcть цифрових потоків Е1 нa кожній ділянці кільця
        </div>
        <table className="table table-bordered">
          <tr className="info">{heads}</tr>
          <tr>{values}</tr>
        </table>
      </div>
    );
  }

});

module.exports = DigitalStreamsSegmentsView;
