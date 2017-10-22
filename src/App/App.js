var Store = require('../Store/Store.js');
var Model = require('../Model/Model.js');
var Template = require('../Template/Template.js');
var View = require('../View/View.js');
var Controller = require('../Controller/Controller.js');

// Allow for looping on nodes by chaining:
// qsa('.foo').forEach(function () {})
NodeList.prototype.forEach = Array.prototype.forEach;

/**
 * Sets up a brand new Todo list.
 *
 * @param {string} name The name of your new to do list.
 */
function App(name) {
  this.storage = new Store(name);
  this.model = new Model(this.storage);
  this.template = new Template();
  this.view = new View(this.template);
  this.controller = new Controller(this.model, this.view);
}

module.exports = App;
