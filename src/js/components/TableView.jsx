'use strict';

const head = ['№ АТС', '1', '2', '3', '4', '5', '6', '7', 'BBC', 'АМТС'];
const labels = ['1', '2', '3', '4', '5', '6', '7', 'АМТС'];

var _ = require('lodash');
var React = require('react');

var ReactArrayOf = React.PropTypes.arrayOf;
var ReactNumber = React.PropTypes.number;

var TableView = React.createClass({

  propTypes: {
    data: ReactArrayOf(ReactArrayOf(ReactNumber.isRequired).isRequired).isRequired,
    title: React.PropTypes.string.isRequired
  },

  getDefaultProps: function() {
    return {
      head  : head, 
      labels: labels 
    };
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

module.exports = TableView;
