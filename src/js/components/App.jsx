'use strict';

// var MainSection = require('./MainSection.react');
var React = require('react');
var InputStore = require('../stores/InputStore');
var InputView = require('./Input');
var InterstationLoadIntensitiesView = require('./InterstationLoadIntensities');

var calculateInterstationLoadIntensities = require('../calculations/interstation-load-intensities');
var calculateInterstationPhoneLoads = require('../calculations/interstation-phone-loads');

/**
 * Retrieve the current Input data from the InputStore
 */
function getInput() {
  return {
    currentVariant: InputStore.getCurrent(),
    data: InputStore.getCurrentVariant(),
    variants: InputStore.getVariants()
  };
}

function getAppState () {
  var $ = {};
  $.input = getInput();
  $.interstationLoadIntensities = calculateInterstationLoadIntensities(
    $.input.data.abonents,
    $.input.data.citiAbonCoef
  );
  $.nterstationPhoneLoads = calculateInterstationPhoneLoads($.interstationLoadIntensities);

  // for (var key in $) {
  //   console.log(key + ':', JSON.stringify($[key], '', 4));
  // }
  // key = 'interstationLoadIntensities';
  // console.log(key + ':', JSON.stringify($[key], '', 4));

  return $;
}

var App = React.createClass({

  getInitialState: function() {
    return getAppState();
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
    // console.warn(this.state);

  	return (
      <div className="container">
        <InputView {...this.state.input}/>
        <InterstationLoadIntensitiesView data={this.state.interstationLoadIntensities}/>
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
    this.setState(getAppState());
  }

});

module.exports = App;
