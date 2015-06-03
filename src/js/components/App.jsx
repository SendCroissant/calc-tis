'use strict';

// var MainSection = require('./MainSection.react');
var React = require('react');
var InputStore = require('../stores/InputStore');

var InputView = require('./Input');
var LoadIntensitiesView = require('./LoadIntensities');
var TableView = require('./TableView');
var TableSummarizedView = require('./TableSummarizedView');
var SchemaStreamsView = require('./SchemaStreamsView');

var calculateLoadIntensities = require('../calculations/load-intensities');
var calculatePhoneLoads = require('../calculations/phone-loads');
var calculateDesignedPhoneLoads = require('../calculations/designed-phone-loads');
var calculateFixedCommunication = require('../calculations/fixed-communication');
var calculateFixedAndMobileCommunication = require('../calculations/fixed-mobile-communication');
var calculateDigitalStreams = require('../calculations/digital-streams');
var calculateDigitalStreamsInet = require('../calculations/digital-streams-inet');
var calculateDigitalStreamsReserved = require('../calculations/digital-streams-reserved');
var calculateDigitalStreamsInterstation = require('../calculations/digital-streams-interstation');

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
  $.digitalStreamsInet = calculateDigitalStreamsInet($.digitalStreams, $.input.data.inet);
  $.digitalStreamsReserved = calculateDigitalStreamsReserved($.digitalStreamsInet);
  $.digitalStreamsInterstation = calculateDigitalStreamsInterstation($.digitalStreamsReserved, $.input.data.schema);

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
  	return (
      <div className="container">
        <InputView {...this.state.input}/>
        <LoadIntensitiesView data={this.state.interstationLoadIntensities}/>

        <TableSummarizedView data={this.state.interstationPhoneLoads}
          title="Мaтриця міжcтaнційних телефонних нaвaнтaжень" />

        <TableSummarizedView data={this.state.designedPhoneLoadsView}
          title="Мaтриця розрaхункових знaчень міжcтaнційних нaвaнтaжень для cтaціонaрних телефонніх з’єднaнь" />

        <TableView data={this.state.fixedCommunication}
          title="Матриця міжстанційних з'єднувальних ліній для фіксованого зв'язку" />

        <TableView data={this.state.fixedAndMobileCommunication}
          title="Матриця міжстанційних з'єднувальних ліній фіксованого і мобільного зв'язку" />

        <TableView data={this.state.digitalStreams}
          title="Матриця цифрових потоків Е1 для ТЛФ фиксир. и мобильн." />

        <TableView data={this.state.digitalStreamsInet}
          title="Матриця цифрових потоків Е1 все ТЛФ + Интернет" />

        <TableView data={this.state.digitalStreamsReserved}
          title="Матриця цифрових потоків всех Е1 с 30% запасом" />

        <SchemaStreamsView data={this.state.digitalStreamsInterstation} />
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
