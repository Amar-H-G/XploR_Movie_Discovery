module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|react-native-vector-icons|react-native-linear-gradient|react-native-fast-image|react-native-reanimated|@react-native-async-storage)',
  ],
  setupFiles: ['./jest.setup.js'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
};
