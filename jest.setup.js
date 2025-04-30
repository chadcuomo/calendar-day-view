import "@testing-library/jest-dom";

// Mock ResizeObserver which might be needed for some UI components
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Suppress React 18+ console errors/warnings during tests
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("ReactDOM.render is no longer supported") ||
      args[0].includes("act(...)"))
  ) {
    return;
  }
  originalError(...args);
};
