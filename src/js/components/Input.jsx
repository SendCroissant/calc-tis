'use strict';

var _ = require('lodash');
var InputActions = require('../actions/InputActions');
var React = require('react');

var ReactArrayOf = React.PropTypes.arrayOf;
var ReactNumber = React.PropTypes.number;

var Input = React.createClass({

  propTypes: {
    currentVariant: ReactNumber.isRequired,
    data: React.PropTypes.shape({
      abonents: ReactArrayOf(ReactNumber.isRequired).isRequired,
      inet: ReactArrayOf(ReactNumber.isRequired).isRequired,
      m2: ReactNumber.isRequired,
    }).isRequired,
    variants: ReactArrayOf(ReactNumber.isRequired).isRequired
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      citiAbonCoef: nextProps.data.citiAbonCoef
    });
  },

  getInitialState: function () {
    return {
      citiAbonCoef: this.props.data.citiAbonCoef
    };
  },

  /**
   * @return {object}
   */
  render: function() {
    var currentVariant = this.props.currentVariant;
    var abonents = this.props.data.abonents;
    var inet = this.props.data.inet;
    var m2 = this.props.data.m2;
    var citiAbonCoef = this.state.citiAbonCoef;

    var atsIndexes = [];
    var atsValues = [];
    var inetIndexes = [];
    var inetValues = [];

    _.forEach(abonents, function (item, index) {
      atsIndexes.push(<th className="text-center" key={index}>{index + 1}</th>);
      atsValues.push(<td className="text-center form-horizontal form-group-lg" key={index}>
        <label className="control-label">{item}</label>
      </td>);
    });

    _.forEach(inet, function (item, index) {
      inetIndexes.push(<th className="text-center" key={index}>{index + 1}</th>);
      inetValues.push(<td className="text-center form-horizontal form-group-lg" key={index}>
        <label className="control-label">{item}</label>
      </td>);
    });

    var options = _.map(this.props.variants, function (item) {
      return <option key={item}>{item}</option>;
    });
    
    return (
      <div className="panel panel-primary">
        <div className="panel-heading">Вхідні дані для розрахунку</div>
        <table className="table table-bordered">
          <tr className="info">
            <th className="text-center" rowSpan={2}>Варіант</th>
            <th className="text-center" colSpan={abonents.length}>
              Параметри АТС мережі (кількість абонентів)
            </th>
            <th className="text-center" colSpan={inet.length}>Швидкість для Інтернету (Гбіт/с)</th>
            <th className="text-center">для СЗРО</th>
            <th className="text-center" rowSpan={2}>
              Кількість мешканців в місті в <nobr>3…4</nobr> раз більше кількості абонентів
            </th>
          </tr>
          <tr className="info">
            {atsIndexes}
            {inetIndexes}
            <th className="text-center" >m<sub>2</sub></th>
          </tr>
          <tr className="common-row">
            <td className="text-center">
              <select className="form-control" value={currentVariant}
                onChange={this._onChangeVariant}>
                {options}
              </select>
            </td>
            {atsValues}
            {inetValues}
            <td className="text-center form-horizontal form-group-lg">
              <label className="control-label">{m2}</label>
            </td>
            <td className="text-center">
              <input className="form-control" type="text" value={citiAbonCoef}
                onChange={this._onChangeCitiAbonCoef} />
            </td>
          </tr>
        </table>
      </div>
    );
  },

  /**
   * Event handler to change "citiAbonCoef" value
   */
  _onChangeCitiAbonCoef: function(event) {
    var value = Number(event.target.value);

    if (event.target.value === value.toString()) {

    InputActions.changeCitiAbonCoef(value);
      return;
    }

    this.setState({
      citiAbonCoef: event.target.value
    });
  },

  /**
   * Event handler to change current variant
   */
  _onChangeVariant: function(event) {
    InputActions.changeCurrent(Number(event.target.value));
  }

});

module.exports = Input;
