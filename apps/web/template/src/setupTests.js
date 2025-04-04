import '@testing-library/jest-dom/extend-expect';  // for jest-dom matchers
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ id: 1, company: 'Google' }, { id: 2, company: 'Microsoft' }])
  })
);
