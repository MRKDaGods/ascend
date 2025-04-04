import React from 'react';  // Add this import

import LinkedInDashboard from '../LinkedInDashboard';
import '@testing-library/jest-dom'; // Import this at the top
import '@testing-library/jest-dom';  // Import jest-dom here for matchers
import { render, screen, waitFor } from '@testing-library/react';


// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ count: 10 }), // mock the response
  })
) as jest.Mock;

describe('LinkedInDashboard', () => {
  beforeEach(() => {
    // Clear mock data before each test
    (fetch as jest.Mock).mockClear();
  });

  it('fetches and displays follower count', async () => {
    render(<LinkedInDashboard />);

    // Verify that the fetch function was called
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/followers');

    // Wait for the follower count to appear on the screen
    await waitFor(() => screen.getByText(/Followers: 10/));

    // Check if the follower count is rendered correctly
    expect(screen.getByText(/Followers: 10/)).toBeInTheDocument();
  });

  it('displays an example follower', async () => {
    render(<LinkedInDashboard />);

    // Wait for the follower list to appear
    await waitFor(() => screen.getByText('Example Follower'));

    // Check if the example follower is rendered
    expect(screen.getByText('Example Follower')).toBeInTheDocument();
  });

  it('handles fetch errors gracefully', async () => {
    // Mock fetch to simulate an error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.reject('Network error'),
      })
    ) as jest.Mock;

    render(<LinkedInDashboard />);

    // Wait for the follower count to be attempted to be fetched
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Check if the component handles the error (can customize based on your error state)
    expect(screen.queryByText(/Followers/)).not.toBeInTheDocument(); // No follower count displayed
  });
});
