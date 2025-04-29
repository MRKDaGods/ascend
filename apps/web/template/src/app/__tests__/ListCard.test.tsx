import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListCard from '../components/ListCard';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '../store/useProfileStore';
import { usePreferencesModal } from '../store/usePreferencesModal';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock profile store
jest.mock('../store/useProfileStore', () => ({
  useProfileStore: jest.fn(),
}));

// Mock preferences modal store
jest.mock('../store/usePreferencesModal', () => ({
  usePreferencesModal: jest.fn(),
}));

// Mock PreferencesModal component
jest.mock('../components/PreferencesModal', () => {
  return function MockPreferencesModal() {
    return <div data-testid="preferences-modal"></div>;
  };
});

// Mock fetch API
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      name: 'Test User',
      email: 'test@example.com',
      role: 'Developer',
    }),
  })
) as jest.Mock;

describe('ListCard Component', () => {
  const mockPush = jest.fn();
  const mockSetUserData = jest.fn();
  const mockOpenModal = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    
    // Setup profile store mock
    (useProfileStore as jest.Mock).mockReturnValue({
      userData: null,
      setUserData: mockSetUserData,
    });
    
    // Setup preferences modal store mock
    (usePreferencesModal as jest.Mock).mockReturnValue({
      openModal: mockOpenModal,
    });
  });
  
  it('renders ListCard with all menu items', () => {
    render(<ListCard />);
    
    // Check if all menu items are rendered
    expect(screen.getByText('Preferences')).toBeInTheDocument();
    expect(screen.getByText('My jobs')).toBeInTheDocument();
    expect(screen.getByText('My Career Insights')).toBeInTheDocument();
    expect(screen.getByText('Post a free job')).toBeInTheDocument();
  });
  
  it('fetches user data on mount when userData is null', async () => {
    render(<ListCard />);
    
    // Wait for the fetch to be called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/user');
    });
    
    // Check if setUserData was called with the fetched data
    await waitFor(() => {
      expect(mockSetUserData).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        role: 'Developer',
      });
    });
  });
  
  it('does not fetch user data when userData exists', async () => {
    // Setup profile store to already have userData
    (useProfileStore as jest.Mock).mockReturnValue({
      userData: { name: 'Existing User' },
      setUserData: mockSetUserData,
    });
    
    render(<ListCard />);
    
    // Wait a moment to ensure fetch isn't called
    await new Promise((r) => setTimeout(r, 100));
    
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockSetUserData).not.toHaveBeenCalled();
  });
  
  it('opens preferences modal when preferences button is clicked', () => {
    render(<ListCard />);
    
    // Click on preferences menu item
    fireEvent.click(screen.getByText('Preferences'));
    
    // Check if openModal was called with the correct parameter
    expect(mockOpenModal).toHaveBeenCalledWith('main');
  });
  
  it('navigates to MyJobs when My jobs button is clicked', () => {
    render(<ListCard />);
    
    // Click on My jobs menu item
    fireEvent.click(screen.getByText('My jobs'));
    
    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith('/MyJobs');
  });
  
  it('navigates to PostJob when Post a free job button is clicked', () => {
    render(<ListCard />);
    
    // Click on Post a free job menu item
    fireEvent.click(screen.getByText('Post a free job'));
    
    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith('/PostJob');
  });
  
  it('renders PreferencesModal component', () => {
    render(<ListCard />);
    
    // Check if the PreferencesModal is rendered
    expect(screen.getByTestId('preferences-modal')).toBeInTheDocument();
  });
  
  it('handles fetch error gracefully', async () => {
    // Mock console.error to prevent error output in tests
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Make fetch throw an error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API error'));
    
    render(<ListCard />);
    
    // Wait for the fetch to fail
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Failed to fetch user data', expect.any(Error));
    });
    
    // Restore console.error
    console.error = originalConsoleError;
  });
});