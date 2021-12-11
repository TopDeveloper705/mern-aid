const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': ['babel-jest', { rootMode: 'upward' }],
    '^.+\\.jison$': [
      path.resolve(__dirname, './src/jison/transformer.js'),
      { 'token-stack': true },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!dagre-d3-renderer/lib).*\\.js'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node', 'jison'],
};
