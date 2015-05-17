'use strict';

const LS_KEY = 'calc-tis-input:';

var _ = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var InputConstants = require('../constants/InputConstants');

var CHANGE_EVENT = 'change';

var stubStorage = {};
stubStorage.getItem = stubStorage.setItem = _.noop;

function InputStore(storage) {
  EventEmitter.call(this);

  this._storage = storage;

  this.readWindowData();
  this.initCurrent();
  this.initCitiAbonCoef();
}
inherits(InputStore, EventEmitter);

/**
 * @param {function} callback
 */
InputStore.prototype.addChangeListener = function(callback) {
  this.on(CHANGE_EVENT, callback);
};

InputStore.prototype.emitChange = function() {
  this.emit(CHANGE_EVENT);
};

/**
 * Get citizens-abonents coefficient.
 * @return {object}
 */
InputStore.prototype.getCitiAbonCoef = function() {
  return Number(this._citiAbonCoef);
};

/**
 * Get the current variant number.
 * @return {object}
 */
InputStore.prototype.getCurrent = function() {
  return Number(this._current);
};

/**
 * Get the current variant.
 * @return {object}
 */
InputStore.prototype.getCurrentVariant = function() {
  var params = this._params[this.getCurrent()];

  return {
    abonents: params.ats_abons,
    inet: params.inet,
    m2: params.m2,
    citiAbonCoef: this.getCitiAbonCoef()
  };
};

/**
 * Get possible variants.
 * @return {object}
 */
InputStore.prototype.getVariants = function() {
  return this._variants;
};

/**
 * Read "citiAbonCoef" value from storage.
 */
InputStore.prototype.initCitiAbonCoef = function() {
  this.setCitiAbonCoef(this._storage.getItem(LS_KEY + 'citiAbonCoef'));
};

/**
 * Read "current" value from storage.
 */
InputStore.prototype.initCurrent = function() {
  this.setCurrent(this._storage.getItem(LS_KEY + 'current'));
};

/**
 * Read input data from window.AppDataParams.
 */
InputStore.prototype.readWindowData = function() {
  this._params = window.AppDataParams.data;
  this._variants = _.map(Object.keys(this._params), Number);
};

/**
 * @param {function} callback
 */
InputStore.prototype.removeChangeListener = function(callback) {
  this.removeListener(CHANGE_EVENT, callback);
};

/**
 * Set the citizens-abonents coefficient.
 * @param {number} value
 */
InputStore.prototype.setCitiAbonCoef = function(value) {
  value = Number(value);

  if (isNaN(value)) {
    value = 3;
  }

  this._citiAbonCoef = value;
  this._storage.setItem(LS_KEY + 'citiAbonCoef', value);
};

/**
 * Set the current variant number.
 * @param {number} value
 */
InputStore.prototype.setCurrent = function(value) {
  value = Number(value);

  var isInvalidValue = isNaN(value) || (typeof this._params[value] === 'undefined');

  if (isInvalidValue) {
    value = this._variants.length && this._variants[0] || null;
  }

  this._current = value;
  this._storage.setItem(LS_KEY + 'current', value);
};

/**
 * Set the current variant number.
 * @param {number} value
 */
InputStore.prototype.setCurrent = function(value) {
  value = Number(value);
  var isInvalidValue = isNaN(value) || (typeof this._params[value] === 'undefined');

  if (isInvalidValue) {
    value = this._variants.length && this._variants[0] || null;
  }

  this._current = value;
  this._storage.setItem(LS_KEY + 'current', value);
};

var instance = new InputStore(window.localStorage || stubStorage);

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch(action.actionType) {
    case InputConstants.CHANGE_CITI_ABON_COEF:
      if (instance.getCitiAbonCoef() !== action.newValue) {
        instance.setCitiAbonCoef(action.newValue);
        instance.emitChange();
      }
    break;
    case InputConstants.CHANGE_CURRENT:
      if (instance.getCurrent() !== action.newVariant) {
        instance.setCurrent(action.newVariant);
        instance.emitChange();
      }
    break;

    default:
      // no op
  }
});

module.exports = instance;
