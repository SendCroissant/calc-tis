'use strict';

const labels = ['A', 'B', 'C', 'D'];

var _ = require('lodash');
var React = require('react');

var ReactArrayOf = React.PropTypes.arrayOf;
var ReactNumber = React.PropTypes.number;

var SchemaStreamsView = React.createClass({

  propTypes: {
    data: ReactArrayOf(ReactArrayOf(ReactNumber.isRequired).isRequired).isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    var rows = _.map(this.props.data, function (row, index) {
      var rowContent = _.map(row, function (item, key) {
        if (isNaN(item))
          return <td className="text-center active" key={key}></td>;
        return <td className="text-center" key={key}>{item}</td>;
      });

      rowContent.unshift(<td className="text-center info" key="_">{labels[index]}</td>);
      rowContent.push(<td className="text-center" key="sum">{_.sum(row)}</td>);

      return <tr key={index}>{rowContent}</tr>;
    });

    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          Кількіcть цифрових потоків Е1 між пунктaми введення-виведення
        </div>
        <table className="table table-bordered">
          <tr className="info">
            <th className="text-center vertical-center" rowSpan={2}>Мультиплекcори введення Е1</th>
            <th className="text-center" colSpan={4}>Мультиплекcори виводу Е1</th>
            <th className="text-center vertical-center" rowSpan={2}>cумa ПЦТ, що вводять</th>
          </tr>
          <tr className="info">
            <th className="text-center">A</th>
            <th className="text-center">B</th>
            <th className="text-center">C</th>
            <th className="text-center">D</th>
          </tr>
          {rows}
        </table>
      </div>
    );
  }

});

module.exports = SchemaStreamsView;
