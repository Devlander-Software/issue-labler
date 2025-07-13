// Jest setup file for GitHub Actions testing
import nock from 'nock';

// Mock GitHub Actions core module
jest.mock('@actions/core', () => ({
  getInput: jest.fn(),
  setOutput: jest.fn(),
  setFailed: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  isDebug: jest.fn(() => false),
}));

// Mock GitHub Actions github module
jest.mock('@actions/github', () => ({
  getOctokit: jest.fn(),
  context: {
    repo: {
      owner: 'test-owner',
      repo: 'test-repo',
    },
    issue: {
      number: 1,
    },
    payload: {
      issue: {
        title: 'Test Issue',
        body: 'Test issue body',
        number: 1,
      },
    },
  },
}));

// Global test setup
beforeAll(() => {
  // Disable real HTTP requests
  nock.disableNetConnect();
});

afterAll(() => {
  // Re-enable real HTTP requests
  nock.enableNetConnect();
  nock.cleanAll();
});

afterEach(() => {
  // Clean up mocks after each test
  jest.clearAllMocks();
  nock.cleanAll();
}); 