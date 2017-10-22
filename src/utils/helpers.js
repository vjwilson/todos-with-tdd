function qs (selector, scope) {
  return (scope || document).querySelector(selector);
}
function qsa (selector, scope) {
  return (scope || document).querySelectorAll(selector);
};

// addEventListener wrapper:
function $on (target, type, callback, useCapture) {
  target.addEventListener(type, callback, !!useCapture);
};

// Attach a handler to event for all elements that match the selector,
// now or in the future, based on a root element
function $delegate (target, selector, type, handler) {
  function dispatchEvent(event) {
    var targetElement = event.target;
    var potentialElements = qsa(selector, target);
    var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

    if (hasMatch) {
      handler.call(targetElement, event);
    }
  }

  // https://developer.mozilla.org/en-US/docs/Web/Events/blur
  var useCapture = type === 'blur' || type === 'focus';

  $on(target, type, dispatchEvent, useCapture);
};

// Find the element's parent with the given tag name:
// $parent(qs('a'), 'div');
function $parent (element, tagName) {
  if (!element.parentNode) {
    return;
  }
  if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
    return element.parentNode;
  }
  return $parent(element.parentNode, tagName);
};

var helpers = {
  qs: qs,
  qsa: qsa,
  $on: $on,
  $delegate: $delegate,
  $parent: $parent,
};

module.exports = helpers;
