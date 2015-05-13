'use strict';

// var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
// var TodoConstants = require('../constants/TodoConstants');

var CHANGE_EVENT = 'change';

// var _todos = {};

// /**
//  * Create a TODO item.
//  * @param  {string} text The content of the TODO
//  */
// function create(text) {
//   // Hand waving here -- not showing how this interacts with XHR or persistent
//   // server-side storage.
//   // Using the current timestamp + random number in place of a real id.
//   var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
//   _todos[id] = {
//     id: id,
//     complete: false,
//     text: text
//   };
// }

// /**
//  * Update a TODO item.
//  * @param  {string} id
//  * @param {object} updates An object literal containing only the data to be
//  *     updated.
//  */
// function update(id, updates) {
//   _todos[id] = assign({}, _todos[id], updates);
// }

// /**
//  * Update all of the TODO items with the same object.
//  *     the data to be updated.  Used to mark all TODOs as completed.
//  * @param  {object} updates An object literal containing only the data to be
//  *     updated.

//  */
// function updateAll(updates) {
//   for (var id in _todos) {
//     update(id, updates);
//   }
// }

// /**
//  * Delete a TODO item.
//  * @param  {string} id
//  */
// function destroy(id) {
//   delete _todos[id];
// }

// /**
//  * Delete all the completed TODO items.
//  */
// function destroyCompleted() {
//   for (var id in _todos) {
//     if (_todos[id].complete) {
//       destroy(id);
//     }
//   }
// }

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
  this._variants = Object.keys(this._params);
  this._current = this._variants.length && this._variants[0] || null;
};

/**
 * @param {function} callback
 */
InputStore.prototype.removeChangeListener = function(callback) {
  this.removeListener(CHANGE_EVENT, callback);
};



//   /**
//    * Tests whether all the remaining TODO items are marked as completed.
//    * @return {boolean}
//    */
//   areAllComplete: function() {
//     for (var id in _todos) {
//       if (!_todos[id].complete) {
//         return false;
//       }
//     }
//     return true;
//   },

//   emitChange: function() {
//     this.emit(CHANGE_EVENT);
//   },


//   /**
//    * @param {function} callback
//    */
//   removeChangeListener: function(callback) {
//     this.removeListener(CHANGE_EVENT, callback);
//   }
// });

// // Register callback to handle all updates
// AppDispatcher.register(function(action) {
//   var text;

//   switch(action.actionType) {
//     case TodoConstants.TODO_CREATE:
//       text = action.text.trim();
//       if (text !== '') {
//         create(text);
//         InputStore.emitChange();
//       }
//       break;

//     case TodoConstants.TODO_TOGGLE_COMPLETE_ALL:
//       if (InputStore.areAllComplete()) {
//         updateAll({complete: false});
//       } else {
//         updateAll({complete: true});
//       }
//       InputStore.emitChange();
//       break;

//     case TodoConstants.TODO_UNDO_COMPLETE:
//       update(action.id, {complete: false});
//       InputStore.emitChange();
//       break;

//     case TodoConstants.TODO_COMPLETE:
//       update(action.id, {complete: true});
//       InputStore.emitChange();
//       break;

//     case TodoConstants.TODO_UPDATE_TEXT:
//       text = action.text.trim();
//       if (text !== '') {
//         update(action.id, {text: text});
//         InputStore.emitChange();
//       }
//       break;

//     case TodoConstants.TODO_DESTROY:
//       destroy(action.id);
//       InputStore.emitChange();
//       break;

//     case TodoConstants.TODO_DESTROY_COMPLETED:
//       destroyCompleted();
//       InputStore.emitChange();
//       break;

//     default:
//       // no op
//   }
// });

module.exports = new InputStore();
