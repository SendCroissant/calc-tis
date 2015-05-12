'use strict';

// var MainSection = require('./MainSection.react');
var React = require('react');
// var TisStore = require('../stores/TisStore');

/**
 * Retrieve the current Tis data from the TisStore
 */
function getTisState() {
  return {
    // allTiss: TisStore.getAll(),
    // areAllComplete: TisStore.areAllComplete()
  };
}

var TisApp = React.createClass({

  getInitialState: function() {
    return getTisState();
  },

  componentDidMount: function() {
    // TisStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    // TisStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
  	return (
      <div>
        {/*<Header />
                <MainSection
                  allTiss={this.state.allTiss}
                  areAllComplete={this.state.areAllComplete}
                />*/}
      </div>
  	);
  },

  /**
   * Event handler for 'change' events coming from the TisStore
   */
  _onChange: function() {
    this.setState(getTisState());
  }

});

module.exports = TisApp;
