import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Recommends from '../components/recommends';
import { useRouter } from 'next/navigation';
import { useSearchStore } from '../store/useSearchStore';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock zustand store
jest.mock('../store/useSearchStore', () => ({
  useSearchStore: jest.fn(),
}));

// Mock localStorage
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

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Recommends Component', () => {
  const mockPush = jest.fn();
  const mockAddSearch = jest.fn();
  const mockClearSearches = jest.fn();
  const mockSetRecentSearches = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    
    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    
    // Setup search store mock with empty recent searches by default
    (useSearchStore as jest.Mock).mockReturnValue({
      recentSearches: [],
      addSearch: mockAddSearch,
      clearSearches: mockClearSearches,
      setRecentSearches: mockSetRecentSearches,
    });
  });
  
  it('renders suggested job searches correctly', () => {
    render(<Recommends />);
    
    // Check heading
    expect(screen.getByText('Suggested job searches')).toBeInTheDocument();
    
    // Check if some of the job chips are rendered
    expect(screen.getByText('marketing manager')).toBeInTheDocument();
    expect(screen.getByText('hr')).toBeInTheDocument();
    expect(screen.getByText('google')).toBeInTheDocument();
  });
  
  it('loads recent searches from localStorage on mount', () => {
    // Set up localStorage with mock data
    const mockData = [
      { job: 'Software Engineer', location: 'New York' },
      { job: 'Product Manager', location: 'Remote' }
    ];
    localStorageMock.setItem('recentJobSearches', JSON.stringify(mockData));
    
    render(<Recommends />);
    
    // Check if setRecentSearches was called with the stored data
    expect(mockSetRecentSearches).toHaveBeenCalledWith(mockData);
  });
  
  it('renders recent searches when they exist', () => {
    // Mock recent searches
    (useSearchStore as jest.Mock).mockReturnValue({
      recentSearches: [
        { job: 'Software Engineer', location: 'New York' },
        { job: 'Product Manager', location: 'Remote' }
      ],
      addSearch: mockAddSearch,
      clearSearches: mockClearSearches,
      setRecentSearches: mockSetRecentSearches,
    });
    
    render(<Recommends />);
    
    // Check if recent searches section is rendered
    expect(screen.getByText('Recent job searches')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
    expect(screen.getByText('Remote')).toBeInTheDocument();
  });
  
  it('handles clicking on a suggested job search', () => {
    render(<Recommends />);
    
    // Find and click on a suggested job search chip
    fireEvent.click(screen.getByText('google'));
    
    // Check if the search was added
    expect(mockAddSearch).toHaveBeenCalledWith({ job: 'google', location: '' });
    
    // Check if router.push was called with the correct search URL
    expect(mockPush).toHaveBeenCalledWith('/search?keyword=google&location=&industry=&experience_level=&company=&salary_range_min=&salary_range_max=&page=1');
  });
  
  it('handles clicking on a recent search', () => {
    // Mock recent searches
    (useSearchStore as jest.Mock).mockReturnValue({
      recentSearches: [
        { job: 'Software Engineer', location: 'New York' }
      ],
      addSearch: mockAddSearch,
      clearSearches: mockClearSearches,
      setRecentSearches: mockSetRecentSearches,
    });
    
    render(<Recommends />);
    
    // Find and click on a recent search
    fireEvent.click(screen.getByText('Software Engineer'));
    
    // Check if the search was added
    expect(mockAddSearch).toHaveBeenCalledWith({ job: 'Software Engineer', location: '' });
    
    // Check if router.push was called with the correct search URL
    expect(mockPush).toHaveBeenCalledWith('/search?keyword=Software%20Engineer&location=&industry=&experience_level=&company=&salary_range_min=&salary_range_max=&page=1');
  });
  
  it('closes the suggested searches section when close button is clicked', () => {
    render(<Recommends />);
    
    // Verify the component is initially rendered
    expect(screen.getByText('Suggested job searches')).toBeInTheDocument();
    
    // Find and click the close button
    const closeButton = screen.getAllByTestId('CloseIcon')[0].closest('button');
    if (closeButton) {
      fireEvent.click(closeButton);
    }
    
    // Check if the suggested searches section is no longer visible
    expect(screen.queryByText('Suggested job searches')).not.toBeInTheDocument();
  });
  
  it('opens the clear search dialog when Clear button is clicked', () => {
    // Mock recent searches
    (useSearchStore as jest.Mock).mockReturnValue({
      recentSearches: [
        { job: 'Software Engineer', location: 'New York' }
      ],
      addSearch: mockAddSearch,
      clearSearches: mockClearSearches,
      setRecentSearches: mockSetRecentSearches,
    });
    
    render(<Recommends />);
    
    // Find and click the Clear button
    fireEvent.click(screen.getByText('Clear'));
    
    // Check if the dialog is shown
    expect(screen.getByText('Clear search history?')).toBeInTheDocument();
    expect(screen.getByText('Your search history is only visible to you and helps us show better results. Are you sure you want to clear it?')).toBeInTheDocument();
  });
  
  it('clears search history when clear is confirmed', async () => {
    // Mock recent searches
    (useSearchStore as jest.Mock).mockReturnValue({
      recentSearches: [
        { job: 'Software Engineer', location: 'New York' }
      ],
      addSearch: mockAddSearch,
      clearSearches: mockClearSearches,
      setRecentSearches: mockSetRecentSearches,
    });
    
    render(<Recommends />);
    
    // Open clear dialog
    fireEvent.click(screen.getByText('Clear'));
    
    // Click the Clear button in the dialog
    const clearDialogButton = screen.getAllByText('Clear')[1]; // The second "Clear" is the one in the dialog
    fireEvent.click(clearDialogButton);
    
    // Check if clearSearches was called
    expect(mockClearSearches).toHaveBeenCalled();
    
    // Add a waitFor to ensure state updates have processed
    await waitFor(() => {
      expect(screen.queryByText('Clear search history?')).not.toBeInTheDocument();
    });
  });
  
  it('closes the clear dialog when Cancel is clicked', async () => {
    // Mock recent searches
    (useSearchStore as jest.Mock).mockReturnValue({
      recentSearches: [
        { job: 'Software Engineer', location: 'New York' }
      ],
      addSearch: mockAddSearch,
      clearSearches: mockClearSearches,
      setRecentSearches: mockSetRecentSearches,
    });
    
    render(<Recommends />);
    
    // Open clear dialog
    fireEvent.click(screen.getByText('Clear'));
    
    // Click the Cancel button
    fireEvent.click(screen.getByText('Cancel'));
    
    // Add a waitFor to ensure state updates have processed
    await waitFor(() => {
      expect(screen.queryByText('Clear search history?')).not.toBeInTheDocument();
    });
    
    // Check that clearSearches wasn't called
    expect(mockClearSearches).not.toHaveBeenCalled();
  });
  
  it('closes the clear dialog when the X button is clicked', async () => {
    // Mock recent searches
    (useSearchStore as jest.Mock).mockReturnValue({
      recentSearches: [
        { job: 'Software Engineer', location: 'New York' }
      ],
      addSearch: mockAddSearch,
      clearSearches: mockClearSearches,
      setRecentSearches: mockSetRecentSearches,
    });
    
    render(<Recommends />);
    
    // Open clear dialog
    fireEvent.click(screen.getByText('Clear'));
    
    // Find and click the X button
    const closeIconInDialog = screen.getAllByTestId('CloseIcon')[1]; // The second CloseIcon is in the dialog
    const closeButton = closeIconInDialog.closest('button');
    if (closeButton) {
      fireEvent.click(closeButton);
    }
    
    // Add a waitFor to ensure state updates have processed
    await waitFor(() => {
      expect(screen.queryByText('Clear search history?')).not.toBeInTheDocument();
    });
    
    // Check that clearSearches wasn't called
    expect(mockClearSearches).not.toHaveBeenCalled();
  });
  
  it('does not render recent searches section when there are no recent searches', () => {
    render(<Recommends />);
    
    // Recent searches section should not be visible
    expect(screen.queryByText('Recent job searches')).not.toBeInTheDocument();
  });
});