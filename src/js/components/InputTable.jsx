'use strict';

var _ = require('lodash');
var InputActions = require('../actions/InputActions');
var React = require('react');

var ReactArrayOf = React.PropTypes.arrayOf;
var ReactNumber = React.PropTypes.number;

var InputTable = React.createClass({

  propTypes: {
    currentVariant: ReactNumber.isRequired,
    input: React.PropTypes.shape({
      ats: ReactArrayOf(ReactNumber.isRequired).isRequired,
      inet: ReactArrayOf(ReactNumber.isRequired).isRequired,
      m2: ReactNumber.isRequired,
    }).isRequired,
    variants: ReactArrayOf(ReactNumber.isRequired).isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    var currentVariant = this.props.currentVariant;
    var ats = this.props.input.ats;
    var inet = this.props.input.inet;
    var m2 = this.props.input.m2;

    var atsIndexes = [];
    var atsValues = [];
    var inetIndexes = [];
    var inetValues = [];

    _.forEach(ats, function (item, index) {
      atsIndexes.push(<th className="text-center" key={index}>{index + 1}</th>);
      atsValues.push(<td className="text-center" key={index}>{item}</td>);
    });

    _.forEach(inet, function (item, index) {
      inetIndexes.push(<th className="text-center" key={index}>{index + 1}</th>);
      inetValues.push(<td className="text-center" key={index}>{item}</td>);
    });

    var options = _.map(this.props.variants, function (item) {
      return <option key={item}>{item}</option>;
    });
    
    return (
      <table className="table table-bordered">
        <tr className="warning">
          <th className="text-center" rowSpan={2}>Варіант</th>
          <th className="text-center" colSpan={ats.length}>Параметри АТС мережі (кількість абонентів)</th>
          <th className="text-center" colSpan={inet.length}>Швидкість для Інтернету (Гбіт/с)</th>
          <th className="text-center" >для СЗРО</th>
        </tr>
        <tr className="warning">
          {atsIndexes}
          {inetIndexes}
          <th className="text-center" >m<sub>2</sub></th>
        </tr>
        <tr>
          <td className="text-center">
            <select className="form-control" value={currentVariant} onChange={this._handleChange}>
              {options}
            </select>
          </td>
          {atsValues}
          {inetValues}
          <td className="text-center">{m2}</td>
        </tr>
      </table>
    );
  },

  /**
   * Event handler to change current variant
   */
  _handleChange: function(event) {
    InputActions.changeCurrent(Number(event.target.value));
  }

});

module.exports = InputTable;
