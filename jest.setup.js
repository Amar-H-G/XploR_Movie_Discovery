// Jest Setup for CineVerse

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};
  return {
    getItem: jest.fn(key => Promise.resolve(store[key] || null)),
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
      return Promise.resolve();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
      return Promise.resolve();
    }),
    multiRemove: jest.fn(keys => {
      keys.forEach(k => delete store[k]);
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      store = {};
      return Promise.resolve();
    }),
  };
});

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Mock react-native-linear-gradient
jest.mock('react-native-linear-gradient', () => 'LinearGradient');

// Mock react-native-fast-image
jest.mock('react-native-fast-image', () => {
  const React = require('react');
  const {Image} = require('react-native');
  const FastImageMock = props => <Image {...props} />;
  FastImageMock.resizeMode = {
    contain: 'contain',
    cover: 'cover',
    stretch: 'stretch',
    center: 'center',
  };
  FastImageMock.priority = {
    low: 'low',
    normal: 'normal',
    high: 'high',
  };
  return FastImageMock;
});

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const inset = {top: 0, right: 0, bottom: 0, left: 0};
  return {
    SafeAreaProvider: ({children}) => children,
    SafeAreaConsumer: ({children}) => children(inset),
    useSafeAreaInsets: () => inset,
  };
});

// Mock @react-native-community/netinfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn(() =>
    Promise.resolve({
      isConnected: true,
      isInternetReachable: true,
    }),
  ),
}));
