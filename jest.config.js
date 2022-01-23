process.env.NODE_ENV = 'test-run';

module.exports = {
  testPathIgnorePatterns: ['node_modules/'],
  rootDir: 'lib',
  moduleFileExtensions: ['js'],
  testEnvironment: 'node',
};
