/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  preset: 'ts-jest',
  coverageProvider: 'v8',
  testMatch: ['<rootDir>/__tests__/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/jest.setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/__tests__/tsconfig.json'
    }
  },
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: ['<rootDir>/__tests__/', '<rootDir>/src/index.ts'],
  reporters: ['default', 'github-actions']
};

export default config;
