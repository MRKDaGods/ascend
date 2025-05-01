import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobsNavbar from '../components/Jobsnavbar';
import { useRouter, usePathname } from 'next/navigation';
import { useSearchStore } from '../store/useSearchStore';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock useSearchStore
jest.mock('../store/useSearchStore', () => ({
  useSearchStore: jest.fn(),
}));

// Mock fetch API
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      name: 'Test User',
      profilePhoto: '/profile.jpg',
      coverPhoto: '/cover.jpg',
      role: 'Developer',
      entity: 'Company',
      location: 'New York'
    }),
  })
) as jest.Mock;

// Mock window.localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('JobsNavbar Component', () => {
  const mockPush = jest.fn();
  const mockAddSearch = jest.fn();
  const mockSetRecentSearches = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (usePathname as jest.Mock).mockReturnValue('/feed');
    
    // Setup zustand store mock with type assertion to fix TypeScript error
    (useSearchStore as unknown as jest.Mock).mockReturnValue({
      recentSearches: [
        { job: 'Frontend Developer', location: 'Remote' },
        { job: 'UX Designer', location: 'New York' }
      ],
      addSearch: mockAddSearch,
      setRecentSearches: mockSetRecentSearches
    });

    // Set local storage mock data
    window.localStorage.setItem('recentJobSearches', JSON.stringify([
      { job: 'Frontend Developer', location: 'Remote' },
      { job: 'UX Designer', location: 'New York' }
    ]));
  });

  it('renders the navbar with all elements', async () => {
    render(<JobsNavbar />);
    
    // Wait for component to load user data
    await waitFor(() => {
      expect(screen.getByText('Ascend')).toBeInTheDocument();
    });
    
    // Check if search inputs are rendered
    expect(screen.getByPlaceholderText('Job title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Location')).toBeInTheDocument();
    
    // Check if navigation buttons are rendered
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try premium/i })).toBeInTheDocument();
  });

  it('navigates when logo is clicked', async () => {
    render(<JobsNavbar />);
    
    await waitFor(() => {
      expect(screen.getByText('Ascend')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Ascend'));
    expect(mockPush).toHaveBeenCalledWith('/feed');
  });

  it('shows dropdown when job title input is focused', async () => {
    render(<JobsNavbar />);
    
    await waitFor(() => {
      const titleInput = screen.getByPlaceholderText('Job title');
      expect(titleInput).toBeInTheDocument();
      
      // Focus the input
      fireEvent.focus(titleInput);
      
      // Check if dropdown appears with recommendations
      expect(screen.getByText('Recommended')).toBeInTheDocument();
      expect(screen.getByText('Recent Searches')).toBeInTheDocument();
    });
  });

  it('updates search params when input changes', async () => {
    render(<JobsNavbar />);
    
    await waitFor(() => {
      const titleInput = screen.getByPlaceholderText('Job title');
      const locationInput = screen.getByPlaceholderText('Location');
      
      // Change inputs
      fireEvent.change(titleInput, { target: { value: 'Software Engineer' } });
      fireEvent.change(locationInput, { target: { value: 'San Francisco' } });
      
      // Check if inputs have new values
      expect((titleInput as HTMLInputElement).value).toBe('Software Engineer');
      expect((locationInput as HTMLInputElement).value).toBe('San Francisco');
    });
  });

  it('performs search when search button is clicked', async () => {
    render(<JobsNavbar />);
    
    await waitFor(() => {
      const titleInput = screen.getByPlaceholderText('Job title');
      const locationInput = screen.getByPlaceholderText('Location');
      const searchButton = screen.getByRole('button', { name: /search/i });
      
      // Change inputs
      fireEvent.change(titleInput, { target: { value: 'Software Engineer' } });
      fireEvent.change(locationInput, { target: { value: 'San Francisco' } });
      
      // Click search button
      fireEvent.click(searchButton);
      
      // Check if search was performed
      expect(mockAddSearch).toHaveBeenCalledWith({
        job: 'Software Engineer',
        location: 'San Francisco'
      });
      
      // Check that we're redirecting to the /search route instead of root (/)
      expect(mockPush).toHaveBeenCalledWith('/search?keyword=Software%20Engineer&location=San%20Francisco');
    });
  });

  it('selects a job title from dropdown when clicked', async () => {
    render(<JobsNavbar />);
    
    await waitFor(() => {
      const titleInput = screen.getByPlaceholderText('Job title');
      
      // Focus to show dropdown
      fireEvent.focus(titleInput);
      
      // Find and click on a recommended job title
      const recommendedTitle = screen.getByText('Software Engineer');
      fireEvent.click(recommendedTitle);
      
      // Check if input was updated
      expect((titleInput as HTMLInputElement).value).toBe('Software Engineer');
    });
  });

  it('loads user data and updates location field', async () => {
    render(<JobsNavbar />);
    
    await waitFor(() => {
      // Check if fetch was called
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/user');
      
      // Check if location field was populated
      const locationInput = screen.getByPlaceholderText('Location');
      expect((locationInput as HTMLInputElement).value).toBe('New York');
    });
  });

  it('navigates to business page when "For Business" is clicked', async () => {
    render(<JobsNavbar />);
    
    await waitFor(() => {
      const businessButton = screen.getByRole('button', { name: /for business/i });
      fireEvent.click(businessButton);
      expect(mockPush).toHaveBeenCalledWith('/for-business');
    });
  });
});