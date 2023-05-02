/* eslint-disable import/no-anonymous-default-export */
export default {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    // Add any other axios methods you use, like put, delete, etc.
  };
  