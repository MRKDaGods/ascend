import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Recommends from '../components/recommends';
import { useRouter } from 'next/navigation';
import { useSearchStore } from '../store/useSearchStore';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock search store
jest.mock('../store/useSearchStore', () => ({
  useSearchStore: jest.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock Dialog implementation to avoid animation issues
jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    Dialog: ({ open, children, onClose }: any) => {
      return open ? <div role="dialog" data-testid="dialog">{children}</div> : null;
    }
  };
});

describe('Recommends Component', () => {
  const mockPush = jest.fn();
  const mockAddSearch = jest.fn();
  const mockClearSearches = jest.fn();
  const mockSetRecentSearches = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    
    // Setup search store mock with empty searches by default - with type assertion
    (useSearchStore as unknown as jest.Mock).mockReturnValue({
      recentSearches: [],
      addSearch: mockAddSearch,
      clearSearches: mockClearSearches,
      setRecentSearches: mockSetRecentSearches,
    });
    
    // Clear localStorage before each test
    localStorage.clear();
  });
  
  it('renders suggested job searches', () => {
    render(<Recommends />);
    
    expect(screen.getByText('Suggested job searches')).toBeInTheDocument();
    
    expect(screen.getByText('marketing manager')).toBeInTheDocument();
    expect(screen.getByText('hr')).toBeInTheDocument();
    expect(screen.getByText('legal')).toBeInTheDocument();
  });
  
  it('renders recent searches when available', () => {
    // Mock recent searches with type assertion
    (useSearchStore as unknown as jest.Mock).mockReturnValue({
      recentSearches: [
        { job: 'Frontend Developer', location: 'Remote' },
        { job: 'UX Designer', location: 'New York' }
      ],
      addSearch: mockAddSearch,
      clearSearches: mockClearSearches,
      setRecentSearches: mockSetRecentSearches,
    });
    
    render(<Recommends />);
    
    expect(screen.getByText('Recent job searches')).toBeInTheDocument();
    
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('UX Designer')).toBeInTheDocument();
  });
  
  it('loads recent searches from localStorage on mount', () => {
    // Set up localStorage with mock data
    const mockStoredSearches = [
      { job: 'Java Developer', location: 'Austin' },
      { job: 'Product Manager', location: 'Seattle' }
    ];
    localStorage.setItem('recentJobSearches', JSON.stringify(mockStoredSearches));
    
    render(<Recommends />);
    
    // Check if setRecentSearches was called with the data from localStorage
    expect(mockSetRecentSearches).toHaveBeenCalledWith(mockStoredSearches);
  });
  
  it('handles search selection correctly', () => {
    render(<Recommends />);
    
    // Click on a recommended search
    fireEvent.click(screen.getByText('marketing manager'));
    
    // Check if addSearch was called with the correct parameters
    expect(mockAddSearch).toHaveBeenCalledWith({
      job: 'marketing manager',
      location: ''
    });
    
    // Updated the expected URL to match the component implementation
    expect(mockPush).toHaveBeenCalledWith(
      '/search?keyword=marketing%20manager&location=&industry=&experience_level=&company=&salary_range_min=&salary_range_max=&page=1'
    );
  });
  
  it('closes the suggested searches section when close button is clicked', () => {
    render(<Recommends />);
    
    // Ensure the component is visible initially
    expect(screen.getByText('Suggested job searches')).toBeInTheDocument();
    
    // Find and click the close button
    const closeButton = screen.getByTestId('CloseIcon').closest('button');
    expect(closeButton).not.toBeNull();
    fireEvent.click(closeButton!);
    
    // The component should no longer be visible
    expect(screen.queryByText('Suggested job searches')).not.toBeInTheDocument();
  });
  
  it('opens the clear search dialog when Clear button is clicked', () => {
    // Mock recent searches with type assertion
    (useSearchStore as unknown as jest.Mock).mockReturnValue({
      recentSearches: [
        { job: 'Software Engineer', location: 'New York' }
      ],
      addSearch: mockAddSearch,
      clearSearches: mockClearSearches,
      setRecentSearches: mockSetRecentSearches,
    });
    
    render(<Recommends />);
    
    // Find and click the Clear button in the header (not the one in dialog)
    const headerClearButton = screen.getAllByText('Clear')[0]; // First Clear button is the header one
    fireEvent.click(headerClearButton);
    
    // Verify dialog is shown
    expect(screen.getByText('Clear search history?')).toBeInTheDocument();
  });
  
  it('closes the clear search dialog when Cancel is clicked', () => {
    // Mock recent searches with type assertion
    (useSearchStore as unknown as jest.Mock).mockReturnValue({
      recentSearches: [
        { job: 'Software Engineer', location: 'New York' }
      ],
      addSearch: mockAddSearch,
      clearSearches: mockClearSearches,
      setRecentSearches: mockSetRecentSearches,
    });
    
    render(<Recommends />);
    
    // Open the dialog using the header Clear button
    const headerClearButton = screen.getAllByText('Clear')[0];
    fireEvent.click(headerClearButton);
    
    // Check dialog is shown
    expect(screen.getByText('Clear search history?')).toBeInTheDocument();
    
    // Click Cancel button
    fireEvent.click(screen.getByText('Cancel'));
    
    // Check that clearSearches was not called
    expect(mockClearSearches).not.toHaveBeenCalled();
  });
  
  it('clears searches when Clear button in dialog is clicked', () => {
    // Mock recent searches with type assertion
    (useSearchStore as unknown as jest.Mock).mockReturnValue({
      recentSearches: [
        { job: 'Software Engineer', location: 'New York' }
      ],
      addSearch: mockAddSearch,
      clearSearches: mockClearSearches,
      setRecentSearches: mockSetRecentSearches,
    });
    
    render(<Recommends />);
    
    // Open the dialog using the header Clear button
    const headerClearButton = screen.getAllByText('Clear')[0];
    fireEvent.click(headerClearButton);
    
    // Find the dialog Clear button by its variant="outlined" attribute
    // Looking at the component, the dialog's Clear button has variant="outlined"
    const dialogClearButtons = screen.getAllByText('Clear');
    
    // Since there are multiple "Clear" buttons, we need to find the one inside the dialog
    // First button is header, second is in dialog
    const dialogClearButton = dialogClearButtons[1];
    fireEvent.click(dialogClearButton);
    
    // Check that clearSearches was called
    expect(mockClearSearches).toHaveBeenCalled();
  });
});