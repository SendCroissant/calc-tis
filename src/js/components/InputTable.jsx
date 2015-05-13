'use strict';

var _ = require('lodash');
var React = require('react');
// var TodoActions = require('../actions/TodoActions');
// var TodoItem = require('./TodoItem.react');

var InputTable = React.createClass({

  propTypes: {
    currentVariant: React.PropTypes.number.isRequired,
    input: React.PropTypes.object.isRequired,
    variants: React.PropTypes.array.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    console.warn(this.props.input);

    var currentVariant = this.props.currentVariant;
    var ats = this.props.input.ats;
    var inet = this.props.input.inet;
    var m2 = this.props.input.m2;

    var atsIndexes = [];
    var atsValues = [];
    var inetIndexes = [];
    var inetValues = [];

    _.forEach(ats, function (item, index) {
      atsIndexes.push(<th key={index}>{index + 1}</th>);
      atsValues.push(<td key={index}>{item}</td>);
    });

    _.forEach(inet, function (item, index) {
      inetIndexes.push(<th key={index}>{index + 1}</th>);
      inetValues.push(<td key={index}>{item}</td>);
    });

    return (
      <table className="table table-bordered table-striped">
        <tr>
          <th rowSpan={2}>Варіант</th>
          <th colSpan={ats.length}>Параметри АТС мережі (кількість абонентів)</th>
          <th colSpan={inet.length}>Швидкість для Інтернету (Гбіт/с)</th>
          <th>для СЗРО</th>
        </tr>
        <tr>
          {atsIndexes}
          {inetIndexes}
          <th>m<sub>2</sub></th>
        </tr>
        <tr>
          <td>{currentVariant}</td>
          {atsValues}
          {inetValues}
          <td>{m2}</td>
        </tr>
      </table>
    );
    // return (
    //   <section id="main">
    //     <input
    //       id="toggle-all"
    //       type="checkbox"
    //       onChange={this._onToggleCompleteAll}
    //       checked={this.props.areAllComplete ? 'checked' : ''}
    //     />
    //     <label htmlFor="toggle-all">Mark all as complete</label>
    //     <ul id="todo-list">{todos}</ul>
    //   </section>
    // );
  },

  /**
   * Event handler to mark all TODOs as complete
   */
  // _onToggleCompleteAll: function() {
  //   TodoActions.toggleCompleteAll();
  // }

});

module.exports = InputTable;
