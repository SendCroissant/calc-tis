'use strict';

// var MainSection = require('./MainSection.react');
var React = require('react');
var InputStore = require('../stores/InputStore');

var InputView = require('./Input');
var LoadIntensitiesView = require('./LoadIntensities');
var PhoneLoadsView = require('./PhoneLoads');
var DesignedPhoneLoadsView = require('./DesignedPhoneLoads');
var FixedCommunicationView = require('./FixedCommunication');
var FixedAndMobileCommunicationView = require('./FixedAndMobileCommunication');
var DigitalStreamsView = require('./DigitalStreams');

var calculateLoadIntensities = require('../calculations/load-intensities');
var calculatePhoneLoads = require('../calculations/phone-loads');
var calculateDesignedPhoneLoads = require('../calculations/designed-phone-loads');
var calculateFixedCommunication = require('../calculations/fixed-communication');
var calculateFixedAndMobileCommunication = require('../calculations/fixed-mobile-communication');
var calculateDigitalStreams = require('../calculations/digital-streams');

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
  $.interstationLoadIntensities = calculateLoadIntensities($.input.data);
  $.interstationPhoneLoads = calculatePhoneLoads($.interstationLoadIntensities);
  $.designedPhoneLoadsView = calculateDesignedPhoneLoads($.interstationPhoneLoads);
  $.fixedCommunication = calculateFixedCommunication($.designedPhoneLoadsView);
  $.fixedAndMobileCommunication = calculateFixedAndMobileCommunication($.fixedCommunication, $.input.data.m2);
  $.digitalStreams = calculateDigitalStreams($.fixedAndMobileCommunication);

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
        <LoadIntensitiesView data={this.state.interstationLoadIntensities}/>
        <PhoneLoadsView data={this.state.interstationPhoneLoads}/>
        <DesignedPhoneLoadsView data={this.state.designedPhoneLoadsView}/>
        <FixedCommunicationView data={this.state.fixedCommunication}/>
        <FixedAndMobileCommunicationView data={this.state.fixedAndMobileCommunication}/>
        <DigitalStreamsView data={this.state.digitalStreams}/>
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
