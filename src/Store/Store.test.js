var Store = require('./Store');

describe('Store tests', function() {
  describe('constructor', function() {
    // white-box test
    //   (knows about the internals of the Store)
    it('should instantiate a store', function() {
      // arrange
      var storageName = 'bodega';

      // act
      var storage = new Store(storageName);

      // assert
      var dataStore = JSON.parse(localStorage.getItem(storageName));
      expect(typeof dataStore).toEqual('object');
    });

    // black-box test
    //   (only tests the public interface of the store object)
    it('should call the given callback when instantiated', function() {
      // arrange
      var storageName = 'scooby';
      var callback = jest.fn();
      var dataStoreShape = {
        todos: []
      };

      // act
      var storage = new Store(storageName, callback);

      // assert
      expect(callback).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(dataStoreShape);
    });
  });

  describe('save function', function() {
    // white-box test
    // if we were using immutable data, this test would fail
    //   why? - because the storage object is changing the actual reference
    //          we pass it, so we are really expecting newItem to be equal
    //          to itself
    it('should save a new item in the data store', function() {
      // arrange
      var storageName = 'scooby';
      var newItem = { name: 'Floss cat' };

      // act
      var storage = new Store(storageName);
      storage.save(newItem);

      // assert
      var dataStore = JSON.parse(localStorage.getItem(storageName));
      expect(dataStore.todos[0]).toEqual(newItem);
    });

    // black-box test
    // better test
    //   why? - because we are testing the interface to the function,
    //          and not peeking into the data store which the function
    //          is managing
    it('should save a new item in the data store', function() {
      // arrange
      var storageName = 'scooby';
      var newItem = { name: 'Floss cat' };

      // act
      var storage = new Store(storageName);
      var saveCallback = jest.fn();
      storage.save(newItem, saveCallback);

      // assert
      //
      // use the "calls" property of a spy:
      //   an array of arrays of arguments
      // since our call returns an array we have to de-reference 3 times:
      //   - the first call [0]
      //   - the first argument [0] of that first call
      //   - the first element [0] of that first argument, of that first call
      var savedItem = saveCallback.mock.calls[0][0][0];
      expect(savedItem.name).toEqual(newItem.name);
      expect(savedItem.id).toBeTruthy();
    });

    it('should update an existing item in the data store', function() {
      // arrange
      var storageName = 'scooby';
      var originalItem = { name: 'Shave yak' };
      var storage = new Store(storageName);
      var saveCallback = jest.fn();
      storage.save(originalItem, saveCallback);

      // act
      var id = saveCallback.mock.calls[0][0][0].id;
      var updatedItem = { name: 'Shave cat', id: id };

      var updateCallback = jest.fn();
      var expectedResult = [updatedItem];
      storage.save(updatedItem, updateCallback, id);

      // assert
      var dataStore = JSON.parse(localStorage.getItem(storageName));
      expect(dataStore.todos[0]).toEqual(updatedItem);
    });

    it('should add a new item when no existing item matches', function() {
      // arrange
      var storageName = 'scooby';
      var originalItem = { name: 'Shave yak' };
      var storage = new Store(storageName);
      var saveCallback = jest.fn();
      storage.save(originalItem, saveCallback);

      // act
      var newItem = { name: 'Shave cat' };

      var updateCallback = jest.fn();
      var expectedResult = newItem;
      storage.save(newItem, updateCallback);

      // assert
      var dataStore = JSON.parse(localStorage.getItem(storageName));
      expect(dataStore.todos[1]).toEqual(expectedResult);
    });

    it('should call the provided callback with a new item when no existing item matches', function() {
      // arrange
      var storageName = 'scooby';
      var originalItem = { name: 'Shave yak' };
      var storage = new Store(storageName);
      var saveCallback = jest.fn();
      storage.save(originalItem, saveCallback);

      // act
      var newItem = { name: 'Shave cat' };

      var updateCallback = jest.fn();
      var expectedResult = [newItem];
      storage.save(newItem, updateCallback);

      // assert
      expect(updateCallback).toHaveBeenCalled();
      expect(updateCallback).toHaveBeenCalledWith(expectedResult);
    });

    it('should call the provided callback with the whole list when a saved item matches an existing item', function() {
      // arrange
      var storageName = 'scooby';
      var originalItem1 = { name: 'Shave yak' };
      var originalItem2 = { name: 'Shave cat' };

      var storage = new Store(storageName);
      var saveCallback = jest.fn();
      storage.save(originalItem1, saveCallback);
      storage.save(originalItem2, saveCallback);

      // act
      var savedItem = saveCallback.mock.calls[1][0][0];
      var updatedItem = { name: 'Floss cat', id: savedItem.id };

      var updateCallback = jest.fn();
      var expectedResult = [
        originalItem1,
        updatedItem
      ];
      storage.save(updatedItem, updateCallback, savedItem.id);

      // assert
      expect(updateCallback).toHaveBeenCalled();
      expect(updateCallback).toHaveBeenCalledWith(expectedResult);
    });
  });

  describe('find function', function() {
    it('should find an item by property in the data store', function() {
      // arrange
      var storageName = 'shaggy';
      var newItem = { name: 'Floss cat' };
      var storage = new Store(storageName);
      storage.save(newItem);

      var findCallback = jest.fn();
      var expectedResult = [newItem];

      // act
      storage.find({ name: 'Floss cat' }, findCallback);

      // assert
      expect(findCallback).toHaveBeenCalledWith(expectedResult);
    });

    it('should return an empty array when no item found', function() {
      // arrange
      var storageName = 'shaggy';
      var newItem = { name: 'Floss cat' };
      var storage = new Store(storageName);
      storage.save(newItem);

      var findCallback = jest.fn();
      var expectedResult = [];

      // act
      storage.find({ name: 'Shampoo cat' }, findCallback);

      // assert
      expect(findCallback).toHaveBeenCalledWith(expectedResult);
    });

    it('should return undefined when no callback given', function() {
      // arrange
      var storageName = 'shaggy';
      var newItem = { name: 'Floss cat' };
      var storage = new Store(storageName);
      storage.save(newItem);

      var expectedResult = undefined;

      // act
      var result = storage.find({ name: 'Floss cat' });

      // assert
      expect(result).toBeUndefined();
    });
  });

  describe('findAll function', function() {
    it('should call the provided callback with the whole list ', function() {
      // arrange
      var storageName = 'scooby';
      var originalItem1 = { name: 'Shave yak' };
      var originalItem2 = { name: 'Shave cat' };

      var storage = new Store(storageName);
      var saveCallback = jest.fn();
      storage.save(originalItem1, saveCallback);
      storage.save(originalItem2, saveCallback);

      // act
      var findAllCallback = jest.fn();
      var expectedResult = [
        originalItem1,
        originalItem2
      ];
      storage.findAll(findAllCallback);

      // assert
      expect(findAllCallback).toHaveBeenCalled();
      expect(findAllCallback).toHaveBeenCalledWith(expectedResult);
    });
  });

  describe('remove function', function() {
    it('should call the provided callback with the list minus the item with the given ID ', function() {
      // arrange
      var storageName = 'scooby';
      var originalItem1 = { name: 'Shave yak' };
      var originalItem2 = { name: 'Shave cat' };

      var storage = new Store(storageName);
      var saveCallback = jest.fn();
      storage.save(originalItem1, saveCallback);
      storage.save(originalItem2, saveCallback);

      // act
      var savedItem = saveCallback.mock.calls[1][0][0];
      var idToRemove = savedItem.id;

      var removeCallback = jest.fn();
      var expectedResult = [
        originalItem1
      ];
      storage.remove(idToRemove, removeCallback);

      // assert
      expect(removeCallback).toHaveBeenCalled();
      expect(removeCallback).toHaveBeenCalledWith(expectedResult);
    });
  });

  describe('drop function', function() {
    it('should call the provided callback with an empty array', function() {
      // arrange
      var storageName = 'scooby';
      var originalItem1 = { name: 'Shave yak' };
      var originalItem2 = { name: 'Shave cat' };

      var storage = new Store(storageName);
      var saveCallback = jest.fn();
      storage.save(originalItem1, saveCallback);
      storage.save(originalItem2, saveCallback);

      // act
      var dropCallback = jest.fn();
      var expectedResult = [];
      storage.drop(dropCallback);

      // assert
      expect(dropCallback).toHaveBeenCalled();
      expect(dropCallback).toHaveBeenCalledWith(expectedResult);
    });
  });
});
