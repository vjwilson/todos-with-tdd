var seleniumWebdriver = require('selenium-webdriver');
var {defineSupportCode} = require('cucumber');
var assert = require('assert');

defineSupportCode(function({Given, When, Then}) {
  var todoInput;

  Given('I am on the Todos with TDD page', function() {
    return this.driver.get('http://localhost:8080');
  });

  When('I look for an element with class {string}', function (className) {
    return this.driver.findElement({ className: className }).then(function(element) {
      todoInput = element;
      return element;
    });
  });

  Then('I should see a placeholder of {string}', function (expectedPlaceholder) {
    return todoInput.getAttribute('placeholder').then(function(placeholder) {
      assert.equal(placeholder, expectedPlaceholder);
    });
  });
});
