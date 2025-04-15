// import '@testing-library/jest-dom';  // Import jest-dom here for matchers
// import { render, screen, waitFor } from '@testing-library/react';
// import LinkedInDashboard from '../LinkedInDashboard';

// describe('LinkedInDashboard', () => {
//   it('fetches and displays follower count', async () => {
//     // Mocking fetch to simulate the API response
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         ok: true,
//         status: 200,
//         json: () => Promise.resolve({ count: 10 }),
//         headers: new Headers(),
//         redirected: false,
//         statusText: 'OK',
//         type: 'basic',
//         url: '',
//         clone: jest.fn(),
//         body: null,
//         bodyUsed: false,
//         arrayBuffer: jest.fn(),
//         blob: jest.fn(),
//         formData: jest.fn(),
//         text: jest.fn(),
//         bytes: jest.fn(), // Add the missing 'bytes' method
//       } as unknown as Response) // Cast to 'unknown' first, then to 'Response'
//     );

//     render(<LinkedInDashboard />);

//     // Check if the follower count is rendered correctly
//     await waitFor(() => expect(screen.getByText(/Followers: 10/)).toBeInTheDocument());
//   });

//   it('displays an example follower', async () => {
//     render(<LinkedInDashboard />);

//     // Check if the example follower is rendered
//     await waitFor(() => expect(screen.getByText('Example Follower')).toBeInTheDocument());
//   });

//   it('handles fetch errors gracefully', async () => {
//     // Mocking fetch to simulate an error
//     global.fetch = jest.fn(() => Promise.reject('API error'));

//     render(<LinkedInDashboard />);

//     // Check if the component handles the error
//     await waitFor(() => expect(screen.queryByText(/Followers/)).not.toBeInTheDocument());
//   });
// });
