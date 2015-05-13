'use strict';

// var MainSection = require('./MainSection.react');
var React = require('react');
var InputStore = require('../stores/InputStore');
var InputTable = require('./InputTable');

/**
 * Retrieve the current Input data from the InputStore
 */
function getInputState() {
  return {
    currentVariant: InputStore.getCurrent(),
    input: InputStore.getCurrentVariant(),
    variants: InputStore.getVariants()
  };
}

var App = React.createClass({

  getInitialState: function() {
    return getInputState();
  },

  componentDidMount: function() {
    InputStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    InputStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
  	return (
      <div className="container">
        <InputTable {...this.state}/>
        {/*<Header />
                <MainSection
                  allTiss={this.state.allTiss}
                  areAllComplete={this.state.areAllComplete}
                />*/}
      </div>
  	);
  },

  /**
   * Event handler for 'change' events coming from the InputStore
   */
  _onChange: function() {
    this.setState(getInputState());
  }

});

module.exports = App;
