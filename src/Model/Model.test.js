var Model = require('./Model');

describe('Model tests', function() {
  describe('constructor', function() {
    // white-box test
    //   (knows about the internals of the Model)
    it('should instantiate a model', function() {
      // arrange
      var mockStore = {};

      // act
      var model = new Model(mockStore);

      // assert
      var modelStorage = model.storage;
      expect(modelStorage).toEqual(mockStore);
    });
  });

  describe('create function', function() {
    // black-box test, with a caveat about mocking
    //   - tests the public interface of the Model
    //   - we have to give the Model a mock implementation of the store object
    it('should create a new todo and add it to the store', function() {
      // arrange
      var mockStore = {
        save: function(todo, callback) {
          callback.call(null, [todo]);
        }
      };
      var model = new Model(mockStore);
      var newTodoTitle = 'Paint bikeshed';
      var createCallback = jest.fn();

      // act
      model.create(newTodoTitle, createCallback);

      // assert
      var expectedTodoList = [{
        title: newTodoTitle,
        completed: false
      }]
      expect(createCallback).toHaveBeenCalledWith(expectedTodoList);
    });

    it('should trim the new todo title', function() {
      // arrange
      var mockStore = {
        save: function(todo, callback) {
          callback.call(null, [todo]);
        }
      };
      var model = new Model(mockStore);
      var newTodoTitle = ' Paint bikeshed     '; // lots of wasted space
      var createCallback = jest.fn();

      // act
      model.create(newTodoTitle, createCallback);

      // assert
      var expectedTodoList = [{
        title: 'Paint bikeshed',
        completed: false
      }]
      expect(createCallback).toHaveBeenCalledWith(expectedTodoList);
    });
  });

  describe('read function', function() {
    it('should pass an object query on to the Store find function', function() {
      // arrange
      var mockStore = {
        find: function(query, callback) {
          callback.call(null, query);
        }
      };
      var model = new Model(mockStore);
      var objectQuery = { title: 'Shave yak' };
      var readCallback = jest.fn();

      // act
      model.read(objectQuery, readCallback);

      // assert
      expect(readCallback).toHaveBeenCalledWith(objectQuery);
    });

    it('should pass a number as an ID query to the Store find function', function() {
      // arrange
      var mockStore = {
        find: function(query, callback) {
          callback.call(null, query);
        }
      };
      var model = new Model(mockStore);
      var id = 42;
      var readCallback = jest.fn();

      // act
      model.read(id, readCallback);

      // assert
      var expectedQuery = { id: id };
      expect(readCallback).toHaveBeenCalledWith(expectedQuery);
    });

    it('should convert a string to a number and pass it as an ID query to the Store find function', function() {
      // arrange
      var mockStore = {
        find: function(query, callback) {
          callback.call(null, query);
        }
      };
      var model = new Model(mockStore);
      var stringId = '13';
      var readCallback = jest.fn();

      // act
      model.read(stringId, readCallback);

      // assert
      var expectedQuery = { id: 13 };
      expect(readCallback).toHaveBeenCalledWith(expectedQuery);
    });

    it('should call the Store findAll function if only passed a callback', function() {
      // arrange
      var mockStore = {
        findAll: function(callback) {
          callback.call(null);
        }
      };
      var model = new Model(mockStore);
      var readCallback = jest.fn();

      // act
      model.read(readCallback);

      // assert
      expect(readCallback).toHaveBeenCalled();
    });
  });

  describe('update function', function() {
    it('should pass updated data and ID to the Store save function', function() {
      // arrange
      var mockStore = {
        save: function(data, callback, id) {
          callback.call(null, data, id);
        }
      };
      var model = new Model(mockStore);
      var updateData = { title: 'Shave cat', id: 12 };
      var updateCallback = jest.fn();

      // act
      model.update(updateData.id, updateData, updateCallback);

      // assert
      expect(updateCallback).toHaveBeenCalledWith(updateData, updateData.id);
    });
  });

  describe('remove function', function() {
    it('should pass ID to remove to the Store remove function', function() {
      // arrange
      var mockStore = {
        remove: function(id, callback) {
          callback.call(null, id);
        }
      };
      var model = new Model(mockStore);
      var idToRemove = 12;
      var removeCallback = jest.fn();

      // act
      model.remove(idToRemove, removeCallback);

      // assert
      expect(removeCallback).toHaveBeenCalledWith(idToRemove);
    });
  });

  describe('removeAll function', function() {
    it('should pass callback to the Store removeAll function', function() {
      // arrange
      var mockStore = {
        drop: function(callback) {
          callback.call(null);
        }
      };
      var model = new Model(mockStore);
      var removeAllCallback = jest.fn();

      // act
      model.removeAll(removeAllCallback);

      // assert
      expect(removeAllCallback).toHaveBeenCalled();
    });
  });
});
