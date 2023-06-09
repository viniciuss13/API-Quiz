/** @type {import('jest').Config} */
const config = {
    verbose: true,
    clearMocks: true,
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
    testMatch: ['<rootDir>/tests/**/*.test.js']
};

module.exports = config;