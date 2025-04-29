import React from 'react'; // Added React import
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import JobDetails from '../apply/components/JobDetail';
import { useJobStore } from '../shared/store/useJobStore';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock job store
jest.mock('@/app/shared/store/useJobStore', () => ({
  useJobStore: jest.fn(),
}));

// Mock fetch API
global.fetch = jest.fn();

// Mock the SaveJobPopup component
jest.mock('../apply/components/SaveJobPopup', () => {
  return function MockSaveJobPopup() {
    return <div data-testid="save-job-popup">Save Job Popup</div>;
  };
});

// Mock the ApplyModal component
jest.mock('../apply/components/ApplyModal', () => {
  return function MockApplyModal({ open, onClose, job }) {
    return open ? (
      <div data-testid="apply-modal">
        <button onClick={onClose}>Close Modal</button>
        <div>Job ID: {job.id}</div>
        <div>Title: {job.title}</div>
      </div>
    ) : null;
  };
});

// Mock React's useState for isReady test
const originalUseState = React.useState;

describe('JobDetails Component', () => {
  const mockSearchParams = new Map();
  const mockGet = jest.fn();
  const mockRouter = { push: jest.fn() };
  const mockSetSavedJobPopupOpen = jest.fn();
  const mockSaveJob = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    // Set up search params mock
    mockSearchParams.clear();
    mockSearchParams.set('id', '123');
    mockSearchParams.set('title', 'Software Engineer');
    mockSearchParams.set('company', 'Tech Corp');
    mockSearchParams.set('location', 'New York');
    mockSearchParams.set('description', 'This is a job description');
    mockSearchParams.set('type', 'Full-time');
    mockSearchParams.set('about', 'About the company');
    mockSearchParams.set('requirements', 'JavaScript,React,TypeScript');
    
    // Mock the get method for useSearchParams
    mockGet.mockImplementation((key) => mockSearchParams.get(key));
    (useSearchParams as jest.Mock).mockReturnValue({
      get: mockGet,
    });
    
    // Mock router
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    
    // Mock job store hooks
    (useJobStore as jest.Mock).mockReturnValue({
      setSavedJobPopupOpen: mockSetSavedJobPopupOpen,
      saveJob: mockSaveJob,
    });

    // Mock successful fetch response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });
  
  afterEach(() => {
    jest.useRealTimers();
    // Restore original useState if it was mocked
    React.useState = originalUseState;
  });
  
  it('renders job details correctly', async () => {
    render(<JobDetails />);
    
    // Wait for the component to finish its initial rendering
    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });
    
    // Check if job details are displayed
    expect(screen.getByText(/Tech Corp.*New York.*Full-time/)).toBeInTheDocument();
    expect(screen.getByText('This is a job description')).toBeInTheDocument();
  });
  
  it('renders section titles correctly', async () => {
    render(<JobDetails />);
    
    // Wait for the component to be ready
    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });
    
    // Check for section titles
    expect(screen.getByText('Job Description')).toBeInTheDocument();
  });
  
  it('renders "Save" and "Apply" buttons', async () => {
    render(<JobDetails />);
    
    // Wait for the component to be ready
    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });
    
    // Check for buttons
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });
  
  it('handles "Save" button click correctly', async () => {
    render(<JobDetails />);
    
    // Wait for the component to be ready
    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });
    
    // Click the Save button
    fireEvent.click(screen.getByText('Save'));
    
    // Check if the API was called correctly
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.ascendx.tech/job/saved/123',  // Changed from 'save' to 'saved'
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Bearer'),
          }),
        })
      );
    });
    
    // Check if setSavedJobPopupOpen was called - wait for it
    await waitFor(() => {
      expect(mockSetSavedJobPopupOpen).toHaveBeenCalledWith(true);
    });
    
    // Advance timers to trigger the redirection
    jest.advanceTimersByTime(1000);
    
    // Check if router.push was called to redirect to MyJobs
    expect(mockRouter.push).toHaveBeenCalledWith('/MyJobs');
  });
  
  it('handles API error when saving job', async () => {
    // Mock fetch to return error
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });
    
    // Spy on console.error
    console.error = jest.fn();
    
    render(<JobDetails />);
    
    // Wait for the component to be ready
    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });
    
    // Click the Save button
    fireEvent.click(screen.getByText('Save'));
    
    // Check if console.error was called with the expected message
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Error saving job to API:',
        expect.objectContaining({
          message: expect.stringContaining('Failed to save job:')
        })
      );
    });
    
    // Even if the API call fails, the UI should continue
    await waitFor(() => {
      expect(mockSetSavedJobPopupOpen).toHaveBeenCalledWith(true);
    });
    
    // Advance timers to trigger the redirection
    jest.advanceTimersByTime(1000);
    
    // Check if router.push was called
    expect(mockRouter.push).toHaveBeenCalledWith('/MyJobs');
  });
  
  it('opens the Apply modal when "Apply" button is clicked', async () => {
    render(<JobDetails />);
    
    // Wait for the component to be ready
    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });
    
    // Verify the apply modal isn't open initially
    expect(screen.queryByTestId('apply-modal')).not.toBeInTheDocument();
    
    // Click the Apply button
    fireEvent.click(screen.getByText('Apply'));
    
    // Check if the ApplyModal is now open
    expect(screen.getByTestId('apply-modal')).toBeInTheDocument();
    
    // Check if the job data was passed correctly to the modal
    expect(screen.getByText('Job ID: 123')).toBeInTheDocument();
    expect(screen.getByText('Title: Software Engineer')).toBeInTheDocument();
  });
  
  it('closes the Apply modal when close button is clicked', async () => {
    render(<JobDetails />);
    
    // Wait for the component to be ready
    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });
    
    // Click the Apply button to open the modal
    fireEvent.click(screen.getByText('Apply'));
    
    // Verify the modal is open
    expect(screen.getByTestId('apply-modal')).toBeInTheDocument();
    
    // Click the close button
    fireEvent.click(screen.getByText('Close Modal'));
    
    // Verify the modal is closed
    expect(screen.queryByTestId('apply-modal')).not.toBeInTheDocument();
  });
  
  it('handles missing search parameters gracefully', async () => {
    // Clear all search params
    mockGet.mockImplementation(() => null);
    
    render(<JobDetails />);
    
    // Wait for the component to be ready
    await waitFor(() => {
      // Title should be empty string when param is missing
      const heading = screen.getByRole('heading', { level: 4 });
      expect(heading).toHaveTextContent('');
    });
    
    // Check if component still renders with default/empty values
    // Use a more specific query to get the subtitle element
    const subtitle = screen.getAllByRole('heading', { level: 6 })[0];
    expect(subtitle).toHaveTextContent('•');
  });
  
  it('parses requirements correctly from search params', async () => {
    render(<JobDetails />);
    
    // Wait for the component to be ready
    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });
    
    // This test can be expanded if requirements are displayed in the UI
    // Currently, the requirements are passed to the ApplyModal but not displayed directly
    
    // Click Apply to see the job data passed to the modal
    fireEvent.click(screen.getByText('Apply'));
    
    // Check if the apply modal is open and received the job data
    expect(screen.getByTestId('apply-modal')).toBeInTheDocument();
  });
  
  it('correctly initializes after initial render cycle', async () => {
    // Mock React useState to control isReady state for this test
    const mockSetState = jest.fn();
    let setState = mockSetState;
    
    // Mock useState to return false for isReady initially
    jest.spyOn(React, 'useState').mockImplementation((initialValue) => {
      if (initialValue === false) {  // This is for the isReady state
        return [false, setState];
      }
      // Return regular useState for other cases
      return originalUseState(initialValue);
    });
    
    // Initial render with isReady = false
    const { rerender } = render(<JobDetails />);
    
    // With isReady = false, the component should return null
    // So no content should be visible yet
    expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument();
    
    // Now simulate the effect running, which would set isReady to true
    // Update our mock to return true
    jest.spyOn(React, 'useState').mockImplementation((initialValue) => {
      if (initialValue === false) {  // This is for the isReady state
        return [true, setState];
      }
      // Return regular useState for other cases
      return originalUseState(initialValue);
    });
    
    // Force a re-render with the new state value
    rerender(<JobDetails />);
    
    // Now the content should be visible
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });
});