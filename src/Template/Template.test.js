var Template = require('./Template');

describe('Template tests', function() {
  describe('constructor', function() {
    // white-box test
    //   (knows about the internals of the Template)
    it('should instantiate a template for a <li> element', function() {
      // arrange
      var re = /<li.+<\/li>/;

      // act
      var template = new Template();

      // assert
      var defaultTemplate = template.defaultTemplate;
      expect(re.test(defaultTemplate)).toBeTruthy();
    });

    it('should instantiate a template with a data attribute for the ID variable', function() {
      // arrange
      var re = /.*data-id="{{id}}".*/;

      // act
      var template = new Template();

      // assert
      var defaultTemplate = template.defaultTemplate;
      expect(re.test(defaultTemplate)).toBeTruthy();
    });

    it('should instantiate a template with a CSS class attribute for the completed variable', function() {
      // arrange
      var re = /.*class="{{completed}}".*/;

      // act
      var template = new Template();

      // assert
      var defaultTemplate = template.defaultTemplate;
      expect(re.test(defaultTemplate)).toBeTruthy();
    });

    it('should instantiate a template a <label> element for the title variable', function() {
      // arrange
      var re = /.*<label>{{title}}<\/label>.*/;

      // act
      var template = new Template();

      // assert
      var defaultTemplate = template.defaultTemplate;
      expect(re.test(defaultTemplate)).toBeTruthy();
    });
  });

  describe('show function', function() {
    // black-box test
    //   - tests the public interface of the Template
    it('should return an empty string when passed an empty array', function() {
      // arrange
      var todos = [];
      var template = new Template();

      // act
      var view = template.show(todos);

      // assert
      expect(view).toBe('');
    });

    // exact match test is good for short data,
    // but this is very brittle
    it('should return one populated <li> when passed an array of one todo', function() {
      // arrange
      var todos = [
        {
          id: 3,
          title: 'Charge flux capacitor',
          completed: true
        }
      ];
      var template = new Template();

      // act
      var view = template.show(todos);

      // assert
      var expectedString = '<li data-id="3" class="completed"><div class="view"><input class="toggle" type="checkbox" checked><label>Charge%20flux%20capacitor</label><button class="destroy"></button></div></li>';
      expect(view).toEqual(expectedString);
    });

    // structure match test,
    // harder to write but less brittle
    it('should return two populated <li> elements when passed an array of two todos', function() {
      // arrange
      var todos = [
        {
          id: 3,
          title: 'Charge flux capacitor',
          completed: true
        },
        {
          id: 5,
          title: 'Watch paint dry',
          completed: false
        }
      ];
      var template = new Template();

      // act
      var view = template.show(todos);

      // assert

      // count occurences of substring, from https://stackoverflow.com/a/4009768/1555572
      var listItemRegex = /<\/li>/g;
      var listItemCount = (view.match(listItemRegex) || []).length;

      expect(listItemCount).toEqual(todos.length);
    });
  });

  describe('itemCounter function', function() {
    // black-box test
    //   - tests the public interface of the Template
    it('should return a singular string when passed count of 1', function() {
      // arrange
      var numActiveTodos = 1;
      var template = new Template();

      // act
      var counterView = template.itemCounter(numActiveTodos);

      // assert
      expect(counterView).toBe('<strong>1</strong> item left');
    });

    it('should return a plural string when passed count of more than 1', function() {
      // arrange
      var numActiveTodos = 2;
      var template = new Template();

      // act
      var counterView = template.itemCounter(numActiveTodos);

      // assert
      expect(counterView).toBe('<strong>2</strong> items left');
    });

    it('should return the correct grammar when passed count of 0', function() {
      // arrange
      var numActiveTodos = 0;
      var template = new Template();

      // act
      var counterView = template.itemCounter(numActiveTodos);

      // assert
      expect(counterView).toBe('<strong>0</strong> items left');
    });
  });

  describe('clearCompletedButton function', function() {
    it('should return an empty string if there are no completed todos', function() {
      // arrange
      var numCompletedTodos = 0;
      var template = new Template();

      // act
      var completedButtonView = template.clearCompletedButton(numCompletedTodos);

      // assert
      expect(completedButtonView).toBe('');
    });

    it('should return a string if there are completed todos', function() {
      // arrange
      var numCompletedTodos = 1;
      var template = new Template();

      // act
      var completedButtonView = template.clearCompletedButton(numCompletedTodos);

      // assert
      expect(completedButtonView).toBe('Clear completed');
    });
  });
});
