var View = require('./View');

describe('View tests', function() {
  describe('constructor', function() {
    // white-box test
    //   (knows about the internals of the View)
    it('should instantiate a view with the supplied template', function() {
      // arrange
      var mockTemplate = {
        show: function() {}
      };

      // act
      var view = new View(mockTemplate);

      // assert
      var viewTemplate = view.template;
      expect(viewTemplate).toEqual(mockTemplate);
    });
  });

  describe('constructor', function() {
    var bodyElement;
    var todoListElement;
    var todoItemCounterElement;
    var clearCompletedElement;
    var mainElement;
    var footerElement;
    var toggleAll;
    var newTodo;

    beforeEach(function() {
      // stub out HTML elements in JSDom document
      // because View is expecting to find and change them
      bodyElement = document.querySelector('body');

      todoListElement = document.createElement('div');
      todoListElement.setAttribute('class', 'todo-list');
      bodyElement.appendChild(todoListElement);

      todoItemCounterElement = document.createElement('div');
      todoItemCounterElement.setAttribute('class', 'todo-count');
      bodyElement.appendChild(todoItemCounterElement);

      clearCompletedElement = document.createElement('div');
      clearCompletedElement.setAttribute('class', 'clear-completed');
      bodyElement.appendChild(clearCompletedElement);

      mainElement = document.createElement('div');
      mainElement.setAttribute('class', 'main');
      bodyElement.appendChild(mainElement);

      footerElement = document.createElement('div');
      footerElement.setAttribute('class', 'footer');
      bodyElement.appendChild(footerElement);

      toggleAll = document.createElement('div');
      toggleAll.setAttribute('class', 'toggle-all');
      bodyElement.appendChild(toggleAll);

      newTodo = document.createElement('div');
      newTodo.setAttribute('class', 'new-todo');
      bodyElement.appendChild(newTodo);
    });

    it('should have a render method that takes a "showEntries" command and a parameter, and calls the supplied template show method', function() {
      // arrange

      var command = 'showEntries';
      var parameter = [{
        id: 1,
        title: 'Attend meeting',
        completed: false
      }];

      var mockTemplate = {
        show: jest.fn()
      };
      var view = new View(mockTemplate);

      // act
      view.render(command, parameter);

      // assert
      expect(mockTemplate.show).toHaveBeenCalledWith(parameter);
    });

    it('should have a render method that takes a "updateElementCount" command and a parameter, and calls the supplied template itemCounter method', function() {
      // arrange

      var command = 'updateElementCount';
      var parameter = 8;

      var mockTemplate = {
        itemCounter: jest.fn()
      };
      var view = new View(mockTemplate);

      // act
      view.render(command, parameter);

      // assert
      expect(mockTemplate.itemCounter).toHaveBeenCalledWith(parameter);
    });
  });
});
