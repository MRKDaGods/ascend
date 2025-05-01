import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import HireCard from '../PostJob/components/HireCard';
import { useRouter } from 'next/navigation';

// Create mock functions outside so they're accessible throughout the tests
const mockSetTitle = jest.fn();
const mockSetCompanyName = jest.fn();
const mockSetCompanyId = jest.fn();

// Mock MUI Autocomplete and TextField together
jest.mock('@mui/material/Autocomplete', () => {
  return {
    __esModule: true,
    default: jest.fn(({ options, value, onChange, renderInput, onInputChange, freeSolo, 'data-testid': dataTestId }) => {
      // Check which Autocomplete we're rendering based on renderInput
      const params = {};
      const inputElement = renderInput(params);
      const isJobTitleInput = inputElement.props.label === 'Job title';
      
      return (
        <div className="mock-autocomplete" data-testid={isJobTitleInput ? "hire-card-job-title-container" : "hire-card-company-select-container"}>
          {isJobTitleInput ? (
            // For job title autocomplete
            <input 
              type="text"
              data-testid="hire-card-job-title"
              value={value || ''}
              onChange={(e) => onInputChange(e, e.target.value)}
              placeholder="Add the title you are hiring for"
            />
          ) : (
            // For company select autocomplete
            <>
              <input 
                type="text" 
                data-testid="company-input"
                placeholder="Select your company"
              />
              <button 
                data-testid="select-company-1" 
                onClick={() => onChange({}, { id: 1, company_id: 101, company_name: 'Test Company 1' })}
              >
                Select Test Company 1
              </button>
              <button 
                data-testid="select-company-2" 
                onClick={() => onChange({}, { id: 2, company_id: 102, company_name: 'Test Company 2' })}
              >
                Select Test Company 2
              </button>
            </>
          )}
        </div>
      );
    })
  };
});

// Mock usepJobStore
jest.mock('@/app/JobPosting/store/usepJobStore', () => {
  // Create a complete mock object structure
  const mockImplementation = function() {
    return {
      setTitle: mockSetTitle,
      setCompanyName: mockSetCompanyName,
    };
  };
  
  // Explicitly define getState with proper typing
  Object.defineProperty(mockImplementation, 'getState', {
    value: () => ({
      setCompanyId: mockSetCompanyId,
    }),
    writable: true,
  });
  
  return {
    usepJobStore: mockImplementation,
  };
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

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
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('renders the component with initial state', async () => {
    render(<HireCard />);
    
    // Initial state should show "Hi there," before API data is loaded
    expect(screen.getByText('Hi there,')).toBeInTheDocument();
    
    // Wait for data fetching and mounting to complete
    await waitFor(() => {
      expect(screen.getByText(/Hi Test User,/)).toBeInTheDocument();
    });
    
    // After API call completes, "Hi there," should be replaced with "Hi Test User,"
    expect(screen.queryByText('Hi there,')).not.toBeInTheDocument();
    
    // Check if basic UI elements are rendered
    expect(screen.getByText(/find your next great hire/)).toBeInTheDocument();
    expect(screen.getByText(/86% of small businesses get a qualified candidate/)).toBeInTheDocument();
    
    // Check if job title input field is rendered using data-testid
    expect(screen.getByTestId('hire-card-job-title')).toBeInTheDocument();
    
    // Check if company select container is rendered using data-testid
    expect(screen.getByTestId('hire-card-company-select-container')).toBeInTheDocument();
    
    // Check if buttons are rendered using data-testid
    expect(screen.getByTestId('hire-card-ai-button')).toBeInTheDocument();
    expect(screen.getByTestId('hire-card-manual-button')).toBeInTheDocument();
    
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
    
    // Find job title input using data-testid
    const jobTitleInput = screen.getByTestId('hire-card-job-title');
    
    // Type into the job title input
    await user.click(jobTitleInput);
    await user.type(jobTitleInput, 'Software Engineer');
    
    // Verify the input value was updated
    expect(jobTitleInput).toHaveValue('Software Engineer');
  });

  it('handles company selection', async () => {
    const user = userEvent.setup();
    render(<HireCard />);
    
    // Wait for component to render and fetch companies
    await waitFor(() => {
      expect(screen.getByText(/Hi Test User,/)).toBeInTheDocument();
    });
    
    // Select company using our mocked button (use the first one we find)
    await user.click(screen.getAllByTestId('select-company-1')[0]);
  });

  it('shows alert when trying to navigate without selecting a company', async () => {
    const user = userEvent.setup();
    render(<HireCard />);
    
    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText(/Hi Test User,/)).toBeInTheDocument();
    });
    
    // Find and enter job title using data-testid
    const jobTitleInput = screen.getByTestId('hire-card-job-title');
    await user.click(jobTitleInput);
    await user.type(jobTitleInput, 'Software Engineer');
    
    // Try to navigate with AI button using data-testid
    await user.click(screen.getByTestId('hire-card-ai-button'));
    
    // Alert should be shown
    expect(global.alert).toHaveBeenCalledWith('Please select a company before proceeding.');
    
    // Router should not be called
    expect(mockPush).not.toHaveBeenCalled();
    
    // Try again with description button using data-testid
    await user.click(screen.getByTestId('hire-card-manual-button'));
    
    // Alert should be shown again
    expect(global.alert).toHaveBeenCalledTimes(2);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('navigates to JobPosting page when "Start with my job description" is clicked with valid inputs', async () => {
    const user = userEvent.setup();
    render(<HireCard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Hi Test User,/)).toBeInTheDocument();
    });
    
    // Select company using our mocked button (use the first one we find)
    await user.click(screen.getAllByTestId('select-company-1')[0]);
    
    // Set job title
    const jobTitleInput = screen.getByTestId('hire-card-job-title');
    await user.click(jobTitleInput);
    await user.type(jobTitleInput, 'Software Engineer');
    
    // Click the manual button
    await user.click(screen.getByTestId('hire-card-manual-button'));
    
    // Verify store functions were called with correct values - using our direct mock references
    expect(mockSetTitle).toHaveBeenCalledWith('Software Engineer');
    expect(mockSetCompanyName).toHaveBeenCalledWith('Test Company 1');
    expect(mockSetCompanyId).toHaveBeenCalledWith(101);
    
    // Verify navigation occurred
    expect(mockPush).toHaveBeenCalledWith('/JobPosting');
  });

  it('navigates to AIpost-job page when "Start hiring with AI" is clicked with valid inputs', async () => {
    const user = userEvent.setup();
    render(<HireCard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Hi Test User,/)).toBeInTheDocument();
    });
    
    // Select company using our mocked button (use the first one we find)
    await user.click(screen.getAllByTestId('select-company-2')[0]);
    
    // Set job title
    const jobTitleInput = screen.getByTestId('hire-card-job-title');
    await user.click(jobTitleInput);
    await user.type(jobTitleInput, 'Frontend Developer');
    
    // Click the AI button
    await user.click(screen.getByTestId('hire-card-ai-button'));
    
    // Verify store functions were called with correct values - using our direct mock references
    expect(mockSetTitle).toHaveBeenCalledWith('Frontend Developer');
    expect(mockSetCompanyName).toHaveBeenCalledWith('Test Company 2');
    expect(mockSetCompanyId).toHaveBeenCalledWith(2);
    
    // Verify navigation occurred
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
});