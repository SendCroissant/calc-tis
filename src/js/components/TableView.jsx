'use strict';

var _ = require('lodash');
var React = require('react');

var ReactArray = React.PropTypes.array;
var ReactArrayOf = React.PropTypes.arrayOf;
var ReactNumber = React.PropTypes.number;

var LoadIntensities = React.createClass({

  propTypes: {
    data: ReactArrayOf(ReactArrayOf(ReactNumber.isRequired).isRequired).isRequired,
    head: ReactArray.isRequired,
    labels: ReactArray.isRequired,
    title: React.PropTypes.string.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    var labels = this.props.labels;

    var headContents = _.map(this.props.head, function (item) {
      return <th className="text-center" key={item}>{item}</th>;
    });

    var rows = _.map(this.props.data, function (row, index) {
      var rowContent = _.map(row, function (item, key) {
        if (isNaN(item))
          return <td className="text-center active" key={key}></td>;
        return <td className="text-center" key={key}>{item}</td>;
      });

      rowContent.unshift(<td className="text-center info" key="_">{labels[index]}</td>);
      return <tr key={index}>{rowContent}</tr>;
    });

    rows.unshift(<tr className="info" key="_">{headContents}</tr>);

    return (
      <div className="panel panel-primary">
        <div className="panel-heading">{this.props.title}</div>
        <table className="table table-bordered">
          {rows}
        </table>
      </div>
    );
  }

});

module.exports = LoadIntensities;
