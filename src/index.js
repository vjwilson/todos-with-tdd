import './index.css';

var App = require('./App/App.js');
var helpers = require('./utils/helpers.js');


var todoApp = new App('todos-with-tdd');

function setView() {
  todoApp.controller.setView(document.location.hash);
}

helpers.$on(window, 'load', setView);
helpers.$on(window, 'hashchange', setView);
