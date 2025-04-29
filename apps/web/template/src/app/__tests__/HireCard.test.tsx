import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import HireCard from '../PostJob/components/HireCard';
import { useRouter } from 'next/navigation';
import * as usepJobStoreModule from '../JobPosting/store/usepJobStore';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the job store
jest.mock('../JobPosting/store/usepJobStore', () => {
  return {
    usepJobStore: jest.fn().mockImplementation(() => ({
      setTitle: jest.fn(),
      setCompanyName: jest.fn(),
    })),
    __esModule: true,
  };
});

// Mock fetch API
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      name: 'Test User',
      data: {
        companies: [
          { id: 1, company_id: 101, company_name: 'Test Company 1' },
          { id: 2, company_id: 102, company_name: 'Test Company 2' }
        ]
      }
    }),
  })
) as jest.Mock;

// Mock alert
global.alert = jest.fn();

describe('HireCard Component', () => {
  const mockPush = jest.fn();
  const mockSetTitle = jest.fn();
  const mockSetCompanyName = jest.fn();
  const mockSetCompanyId = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    
    // Setup store mock using direct property assignment
    (usepJobStoreModule.usepJobStore as jest.Mock).mockReturnValue({
      setTitle: mockSetTitle,
      setCompanyName: mockSetCompanyName
    });
    
    // Mock the getState method on the store
    (usepJobStoreModule.usepJobStore as any).getState = jest.fn().mockReturnValue({
      setCompanyId: mockSetCompanyId
    });
  });

  it('renders the component with initial state', async () => {
    render(<HireCard />);
    
    // Initial state should show "Hi there," before API data is loaded
    expect(screen.getByText('Hi there,')).toBeInTheDocument();
    
    // Wait for data fetching and mounting to complete
    await waitFor(() => {
      expect(screen.getByText('Hi Test User,')).toBeInTheDocument();
    });
    
    // After API call completes, "Hi there," should be replaced with "Hi Test User,"
    expect(screen.queryByText('Hi there,')).not.toBeInTheDocument();
    
    // Check if basic UI elements are rendered
    expect(screen.getByText(/find your next great hire/)).toBeInTheDocument();
    expect(screen.getByText(/86% of small businesses get a qualified candidate/)).toBeInTheDocument();
    
    // Check if form elements are rendered
    expect(screen.getByText('Job title')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    
    // Check if buttons are rendered
    expect(screen.getByText(/✨ Start hiring with AI/)).toBeInTheDocument();
    expect(screen.getByText('Start with my job description')).toBeInTheDocument();
    
    // Check if info section is rendered
    expect(screen.getByText(/Rated #1 in increasing quality of hire/)).toBeInTheDocument();
  });

  it('fetches user data and companies on mount', async () => {
    render(<HireCard />);
    
    // Wait for component to handle useEffect
    await waitFor(() => {
      // Check if fetch was called for user data
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/user');
      
      // Check if fetch was called for companies
      expect(global.fetch).toHaveBeenCalledWith('https://api.ascendx.tech/company/companies', 
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Bearer')
          })
        })
      );
    });
  });

  it('handles job title selection', async () => {
    const user = userEvent.setup();
    render(<HireCard />);
    
    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText(/Hi Test User,/)).toBeInTheDocument();
    });
    
    // Find and click job title input to open dropdown
    const jobTitleInput = screen.getByPlaceholderText('Add the title you are hiring for');
    await user.click(jobTitleInput);
    await user.type(jobTitleInput, 'Software');
    
    // Wait for autocomplete options to appear
    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });
    
    // Select an option
    await user.click(screen.getByText('Software Engineer'));
    
    // Value should be updated in the input
    expect(jobTitleInput).toHaveValue('Software Engineer');
  });

  it('handles company selection', async () => {
    const user = userEvent.setup();
    render(<HireCard />);
    
    // Wait for component to render and fetch companies
    await waitFor(() => {
      expect(screen.getByText(/Hi Test User,/)).toBeInTheDocument();
    });
    
    // Find and click company input to open dropdown
    const companyInput = screen.getByPlaceholderText('Select your company');
    await user.click(companyInput);
    
    // Wait for autocomplete options to appear
    await waitFor(() => {
      expect(screen.getByText('Test Company 1')).toBeInTheDocument();
      expect(screen.getByText('Test Company 2')).toBeInTheDocument();
    });
    
    // Select a company
    await user.click(screen.getByText('Test Company 1'));
    
    // Company should be selected
    expect(companyInput).toHaveValue('Test Company 1');
  });

  it('shows alert when trying to navigate without selecting a company', async () => {
    const user = userEvent.setup();
    render(<HireCard />);
    
    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText(/Hi Test User,/)).toBeInTheDocument();
    });
    
    // Select job title but no company
    const jobTitleInput = screen.getByPlaceholderText('Add the title you are hiring for');
    await user.click(jobTitleInput);
    await user.type(jobTitleInput, 'Software Engineer');
    
    // Try to navigate with AI button
    await user.click(screen.getByText(/✨ Start hiring with AI/));
    
    // Alert should be shown
    expect(global.alert).toHaveBeenCalledWith('Please select a company before proceeding.');
    
    // Router should not be called
    expect(mockPush).not.toHaveBeenCalled();
    
    // Try again with description button
    await user.click(screen.getByText('Start with my job description'));
    
    // Alert should be shown again
    expect(global.alert).toHaveBeenCalledTimes(2);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('navigates to JobPosting page when "Start with my job description" is clicked with valid inputs', async () => {
    const user = userEvent.setup();
    render(<HireCard />);
    
    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText(/Hi Test User,/)).toBeInTheDocument();
    });
    
    // Enter job title
    const jobTitleInput = screen.getByPlaceholderText('Add the title you are hiring for');
    await user.click(jobTitleInput);
    await user.type(jobTitleInput, 'Software Engineer');
    
    // Select company
    const companyInput = screen.getByPlaceholderText('Select your company');
    await user.click(companyInput);
    await waitFor(() => {
      expect(screen.getByText('Test Company 1')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Test Company 1'));
    
    // Click "Start with my job description" button
    await user.click(screen.getByText('Start with my job description'));
    
    // Store values should be set
    expect(mockSetTitle).toHaveBeenCalledWith('Software Engineer');
    expect(mockSetCompanyName).toHaveBeenCalledWith('Test Company 1');
    expect(mockSetCompanyId).toHaveBeenCalledWith(101);
    
    // Router should navigate to JobPosting
    expect(mockPush).toHaveBeenCalledWith('/JobPosting');
  });

  it('navigates to AIpost-job page when "Start hiring with AI" is clicked with valid inputs', async () => {
    const user = userEvent.setup();
    render(<HireCard />);
    
    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText(/Hi Test User,/)).toBeInTheDocument();
    });
    
    // Enter job title
    const jobTitleInput = screen.getByPlaceholderText('Add the title you are hiring for');
    await user.click(jobTitleInput);
    await user.type(jobTitleInput, 'Frontend Developer');
    
    // Select company
    const companyInput = screen.getByPlaceholderText('Select your company');
    await user.click(companyInput);
    await waitFor(() => {
      expect(screen.getByText('Test Company 2')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Test Company 2'));
    
    // Click "Start hiring with AI" button
    await user.click(screen.getByText(/✨ Start hiring with AI/));
    
    // Store values should be set
    expect(mockSetTitle).toHaveBeenCalledWith('Frontend Developer');
    expect(mockSetCompanyName).toHaveBeenCalledWith('Test Company 2');
    expect(mockSetCompanyId).toHaveBeenCalledWith(2);
    
    // Router should navigate to AIpost-job
    expect(mockPush).toHaveBeenCalledWith('/AIpost-job');
  });

  it('handles fetch errors gracefully', async () => {
    // Mock console.error to prevent error output in tests
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Mock fetch to reject
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API error'));
    
    render(<HireCard />);
    
    // Wait for error to be logged
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Failed to fetch user:', expect.any(Error));
    });
    
    // Component should still render with default name
    expect(screen.getByText(/Hi there,/)).toBeInTheDocument();
    
    // Restore console.error
    console.error = originalConsoleError;
  });

  it('doesn\'t render content until mounted', () => {
    // Mock useEffect to prevent it from running immediately
    const originalUseEffect = React.useEffect;
    React.useEffect = jest.fn();
    
    render(<HireCard />);
    
    // Since hasMounted is false and useEffect is mocked, component should return null
    expect(screen.queryByText(/find your next great hire/)).not.toBeInTheDocument();
    
    // Restore useEffect
    React.useEffect = originalUseEffect;
  });
});