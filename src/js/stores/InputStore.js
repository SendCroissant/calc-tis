'use strict';

var _ = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var InputConstants = require('../constants/InputConstants');

var CHANGE_EVENT = 'change';

function InputStore() {
  EventEmitter.call(this);

  this.readWindowData();
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
  return this._params[this.getCurrent()];
};

/**
 * Get possible variants.
 * @return {object}
 */
InputStore.prototype.getVariants = function() {
  return this._variants;
};

/**
 * Read inpur data from window.AppDataParams
 */
InputStore.prototype.readWindowData = function() {
  this._params = window.AppDataParams.data;
  this._variants = _.map(Object.keys(this._params), Number);
  this._current = this._variants.length && this._variants[0] || null;
};

/**
 * @param {function} callback
 */
InputStore.prototype.removeChangeListener = function(callback) {
  this.removeListener(CHANGE_EVENT, callback);
};

/**
 * Set the current variant number.
 * @param {number} newVariant
 */
InputStore.prototype.setCurrent = function(newVariant) {
  this._current = newVariant;
};

var instance = new InputStore();

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch(action.actionType) {
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
