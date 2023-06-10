/** @type {import('jest').Config} */


const config = {
    verbose: true,
    clearMocks: true,
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
    testMatch: ['<rootDir>/tests/**/*.test.js'],
    collectCoverage: true,
    coveragePathIgnorePatterns: ['<rootDir>/node_modules'],
    coverageReporters: ['text', 'text-summary', 'json', 'html', 'lcov']
};

module.exports = config;