const { jest } = require('@jest/globals');

// Mock reflect-metadata for inversify
require('reflect-metadata');

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map();
  return {
    __esModule: true,
    default: {
      setItem: jest.fn((key, value) => {
        store.set(key, value);
        return Promise.resolve();
      }),
      getItem: jest.fn((key) => {
        return Promise.resolve(store.get(key) ?? null);
      }),
      removeItem: jest.fn((key) => {
        store.delete(key);
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        store.clear();
        return Promise.resolve();
      }),
      _store: store,
    },
  };
});
