'use strict';

var _ = require('lodash');
var React = require('react');

var DijkstraCirclesView = React.createClass({

  propTypes: {
    data: React.PropTypes.array.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    var selected = null;
    var min = Infinity;

    _.forEach(this.props.data, function (path, index) {
      // console.warn('#', i, min, dist[i]);
      if (min === path.length) return selected.push(index);
      if (min > path.length) {
        min = path.length;
        selected = [index];
        return;
      }
    });

    var rows = _.map(this.props.data, function (path, index) {
      var rowClass = '';
      var pathContent = _.map(path.vertices, _.add.bind(null, 1)).join(' → ');
      var lengthContent = path.length;

      if (_.indexOf(selected, index) >= 0) {
        rowClass = 'success';
        pathContent = <strong>{pathContent}</strong>;
        lengthContent = <strong>{lengthContent}</strong>;
      }

      return (
        <tr key={index} className={rowClass}>
          <td className="text-center">{pathContent}</td>
          <td className="text-center">{lengthContent}</td>
        </tr>
      );
    });

    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          Оптимізaція cумaрних відcтaней між мережними вузлaми зa методом Дейкcтри
        </div>
        <table className="table table-bordered">
          <tr className="info">
            <th className="text-center vertical-center">Шлях</th>
            <th className="text-center vertical-center">Довжина шляху</th>
          </tr>
          {rows}
        </table>
      </div>
    );
  }

});

module.exports = DijkstraCirclesView;
