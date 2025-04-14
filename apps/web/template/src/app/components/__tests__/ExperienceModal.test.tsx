import React from 'react';  // Add this import

import LinkedInDashboard from '../LinkedInDashboard';
import ExperienceModal from '../ExperienceModal';

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ count: 10 }), // mock the response
  })
) as jest.Mock;

const mockOnClose = jest.fn();
const mockOnSave = jest.fn();

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

describe('ExperienceModal Component', () => {
  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSave.mockClear();
  });

  it('renders when open', () => {
    render(<ExperienceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
    expect(screen.getByText('Manage Experiences')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    const { container } = render(<ExperienceModal isOpen={false} onClose={mockOnClose} onSave={mockOnSave} />);
    expect(container.firstChild).toBeNull();
  });

  it('adds a new experience form when "Add Experience" is clicked', () => {
    render(<ExperienceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
    const addButton = screen.getByText('Add Experience');
    fireEvent.click(addButton);
    expect(screen.getAllByPlaceholderText('Company name').length).toBe(1);
  });

  it('updates experience fields correctly', () => {
    render(<ExperienceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
    const addButton = screen.getByText('Add Experience');
    fireEvent.click(addButton);

    const companyInput = screen.getByPlaceholderText('Company name') as HTMLInputElement;
    fireEvent.change(companyInput, { target: { value: 'Google' } });
    expect(companyInput.value).toBe('Google');
  });

  it('removes an experience form when "Remove" is clicked', () => {
    render(<ExperienceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
    const addButton = screen.getByText('Add Experience');
    fireEvent.click(addButton);

    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);
    expect(screen.queryByPlaceholderText('Company name')).toBeNull();
  });

  it('calls onSave with correct data when "Save All" is clicked', () => {
    render(<ExperienceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
    const addButton = screen.getByText('Add Experience');
    fireEvent.click(addButton);

    const companyInput = screen.getByPlaceholderText('Company name');
    fireEvent.change(companyInput, { target: { value: 'Google' } });

    const saveButton = screen.getByText('Save All');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          company: 'Google',
        }),
      ])
    );
  });

  it('calls onClose when close button is clicked', () => {
    render(<ExperienceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
