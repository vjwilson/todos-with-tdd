var helpers = require('./helpers');

describe('helpers tests', function() {
  describe('qs', function() {
    it('should find a node in the whole document', function() {
      // arrange
      var containerElement = document.createElement('div');
      containerElement.setAttribute('id', 'container');

      var bodyElement = document.querySelector('body');
      bodyElement.appendChild(containerElement);

      var nodeIdToFind = '#container';

      // act
      var node = helpers.qs(nodeIdToFind);

      // assert
      expect(node).toBeTruthy();
    });

    it('should find a node in the specified document section', function() {
      // arrange
      var containerElement = document.createElement('div');
      containerElement.setAttribute('id', 'container');
      var heroElement = document.createElement('section');
      heroElement.setAttribute('id', 'hero');

      var bodyElement = document.querySelector('body');
      bodyElement.appendChild(containerElement);
      containerElement.appendChild(heroElement);

      var scope = containerElement;
      var nodeIdToFind = '#hero';

      // act
      var node = helpers.qs(nodeIdToFind, scope);

      // assert
      expect(node).toBeTruthy();
    });
  });
});
