import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import JobCard from '../MyJobs/components/JobCard';
import { useRouter } from 'next/navigation';
import { useJobStore } from '../shared/store/useJobStore';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the job store
jest.mock('../shared/store/useJobStore', () => ({
  useJobStore: jest.fn(),
}));

// Instead of mocking the entire MUI library, just mock specific components
jest.mock('@mui/material/Dialog', () => {
  return function MockDialog({ open, children }: { open: boolean; children: React.ReactNode }) {
    return open ? <div data-testid="mock-dialog">{children}</div> : null;
  };
});

jest.mock('@mui/material/Snackbar', () => {
  return function MockSnackbar({ open, children }: { open: boolean; children: React.ReactNode }) {
    return open ? <div data-testid="mock-snackbar">{children}</div> : null;
  };
});

// Add proper type annotations for the Alert mock
jest.mock('@mui/material/Alert', () => {
  return function MockAlert(props: { 
    severity?: 'error' | 'warning' | 'info' | 'success'; 
    children: React.ReactNode;
    [key: string]: any;
  }) {
    const { severity, children, ...rest } = props;
    return (
      <div data-testid={`mock-alert-${severity}`} {...rest}>
        {children}
      </div>
    );
  };
});

// Mock fetch API
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      title: 'Updated Software Engineer',
      description: 'Updated job description',
      industry: 'Technology',
      type: 'Full-time',
      experience_level: 'Mid',
      location: 'New York',
      workplace_type: 'Remote',
      salary_min_range: 80000,
      salary_max_range: 120000
    }),
  })
) as jest.Mock;

// Mock console.error
console.error = jest.fn();

// Mock setTimeout
jest.useFakeTimers();

describe('JobCard Component', () => {
  // Mock props
  const mockJob = {
    job_id: 123,
    title: 'Software Engineer',
    description: 'Join our team as a software engineer',
    industry: 'Technology',
    type: 'Full-time',
    experience_level: 'Mid',
    location: 'New York',
    workplace_type: 'Remote',
    salary_min_range: 70000,
    salary_max_range: 100000,
    company_name: 'Acme Inc',
    company_logo_url: 'https://example.com/logo.png',
    saved_at: new Date('2023-05-15'),
    created_at: new Date('2023-05-10'),
    company_industry: 'Software',
    company_location: 'San Francisco',
    status: 'Posted' as const,
  };

  // Mock handlers and router
  const mockOnDelete = jest.fn();
  const mockDeletePostedJob = jest.fn().mockResolvedValue(true);
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock router
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    
    // Mock job store with type assertion for TypeScript
    (useJobStore as unknown as jest.Mock).mockReturnValue({
      deletePostedJob: mockDeletePostedJob,
    });
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  it('renders the job card with correct information', () => {
    render(<JobCard {...mockJob} onDelete={mockOnDelete} />);
    
    // Check if job title is displayed
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    
    // Check if company name is displayed
    expect(screen.getByText(/Acme Inc/)).toBeInTheDocument();
    
    // Check if job type is displayed
    expect(screen.getByText('Full-time')).toBeInTheDocument();
    
    // Check if job status is displayed
    expect(screen.getByText('Posted')).toBeInTheDocument();
    
    // Check if posted date is displayed
    expect(screen.getByText(/Posted on/)).toBeInTheDocument();
    
    // Check if buttons for posted jobs are displayed
    expect(screen.getByText('View Applications')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('opens the job details modal when card is clicked', () => {
    render(<JobCard {...mockJob} onDelete={mockOnDelete} />);
    
    // Click the card
    fireEvent.click(screen.getByText('Software Engineer'));
    
    // Check if modal is opened with job details
    expect(screen.getByTestId('mock-dialog')).toBeInTheDocument();
    expect(screen.getByText('Job Description')).toBeInTheDocument();
    expect(screen.getByText('Job Details')).toBeInTheDocument();
    expect(screen.getByText(/Join our team as a software engineer/)).toBeInTheDocument();
    
    // Check if salary is formatted correctly
    expect(screen.getByText('$70,000 - $100,000')).toBeInTheDocument();
  });

  it('navigates to applications page when View Applications button is clicked', () => {
    render(<JobCard {...mockJob} onDelete={mockOnDelete} />);
    
    // Click the View Applications button
    const viewApplicationsBtn = screen.getAllByText('View Applications')[0]; // Get the button on the card, not in modal
    fireEvent.click(viewApplicationsBtn);
    
    // Check if router.push was called with correct URL
    expect(mockPush).toHaveBeenCalledWith(
      '/job/123/applications?title=Software%20Engineer&company=Acme%20Inc&location=New%20York'
    );
  });

  it('enables edit mode when Edit button is clicked', async () => {
    render(<JobCard {...mockJob} onDelete={mockOnDelete} />);
    
    // Click the Edit button
    fireEvent.click(screen.getByText('Edit'));
    
    // Check if edit mode is activated
    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });
    
    // Check input fields
    expect(screen.getByLabelText('Job Title')).toHaveValue('Software Engineer');
    expect(screen.getByLabelText('Job Description')).toHaveValue('Join our team as a software engineer');
  });

  it('updates job details and saves changes', async () => {
    // Set up user interactions
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<JobCard {...mockJob} onDelete={mockOnDelete} />);
    
    // Click the Edit button to enter edit mode
    await user.click(screen.getByText('Edit'));
    
    // Wait for edit mode UI to appear
    await waitFor(() => {
      expect(screen.getByLabelText('Job Title')).toBeInTheDocument();
    });
    
    // Enter new job title
    await user.clear(screen.getByLabelText('Job Title'));
    await user.type(screen.getByLabelText('Job Title'), 'Senior Software Engineer');
    
    // Enter new job description
    await user.clear(screen.getByLabelText('Job Description'));
    await user.type(screen.getByLabelText('Job Description'), 'New job description');
    
    // Click Save Changes button
    await user.click(screen.getByText('Save Changes'));
    
    // Check if API was called with correct data
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.ascendx.tech/job/123',
        expect.objectContaining({
          method: 'PATCH',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: expect.stringContaining('"title":"Senior Software Engineer"')
        })
      );
    });
    
    // Check if success message is shown 
    await waitFor(() => {
      expect(screen.getByTestId('mock-snackbar')).toBeInTheDocument();
      expect(screen.getByTestId('mock-alert-success')).toBeInTheDocument();
      expect(screen.getByText('Job details updated successfully!')).toBeInTheDocument();
    });
    
    // Advance timers to trigger the modal close
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    
    // Check modal is closed
    await waitFor(() => {
      expect(screen.queryByTestId('mock-dialog')).not.toBeInTheDocument();
    });
  }, 10000); // Add timeout to prevent test timeout

  it('shows No changes to save message when no edits are made', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<JobCard {...mockJob} onDelete={mockOnDelete} />);
    
    // Click the Edit button to enter edit mode
    await user.click(screen.getByText('Edit'));
    
    // Wait for edit mode to be active
    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });
    
    // Click Save Changes without making any changes
    await user.click(screen.getByText('Save Changes'));
    
    // Check if proper message is shown
    await waitFor(() => {
      expect(screen.getByTestId('mock-snackbar')).toBeInTheDocument();
      expect(screen.getByTestId('mock-alert-success')).toBeInTheDocument();
      expect(screen.getByText('No changes to save')).toBeInTheDocument();
    });
    
    // The API should not be called
    expect(global.fetch).not.toHaveBeenCalled();
  }, 10000);

  it('handles API errors when saving changes', async () => {
    // Mock fetch to return error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<JobCard {...mockJob} onDelete={mockOnDelete} />);
    
    // Click the Edit button
    await user.click(screen.getByText('Edit'));
    
    // Wait for edit mode to be active
    await waitFor(() => {
      expect(screen.getByLabelText('Job Title')).toBeInTheDocument();
    });
    
    // Make a change
    await user.clear(screen.getByLabelText('Job Title'));
    await user.type(screen.getByLabelText('Job Title'), 'Failed Job Title');
    
    // Click Save Changes
    await user.click(screen.getByText('Save Changes'));
    
    // Check if error is logged and error message is shown
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error updating job:', expect.any(Error));
      expect(screen.getByTestId('mock-snackbar')).toBeInTheDocument();
      expect(screen.getByTestId('mock-alert-success')).toBeInTheDocument();
      expect(screen.getByText('Failed to update job. Please try again.')).toBeInTheDocument();
    });
  }, 10000);

  it('opens delete confirmation dialog when delete button is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<JobCard {...mockJob} onDelete={mockOnDelete} />);
    
    // Find and click the delete button
    const deleteButton = screen.getByTestId('DeleteIcon').closest('button');
    await user.click(deleteButton!);
    
    // Check if confirmation dialog is shown
    await waitFor(() => {
      expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    });
  }, 10000);

  it('cancels job deletion when Cancel is clicked in dialog', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<JobCard {...mockJob} onDelete={mockOnDelete} />);
    
    // Open delete dialog
    const deleteButton = screen.getByTestId('DeleteIcon').closest('button');
    await user.click(deleteButton!);
    
    // Wait for dialog to appear
    await waitFor(() => {
      expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    });
    
    // Click Cancel
    await user.click(screen.getByText('Cancel'));
    
    // Check if no deletion happened
    expect(mockDeletePostedJob).not.toHaveBeenCalled();
  }, 10000);

  it('deletes job when confirmed in dialog', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<JobCard {...mockJob} onDelete={mockOnDelete} />);
    
    // Open delete dialog
    const deleteButton = screen.getByTestId('DeleteIcon').closest('button');
    await user.click(deleteButton!);
    
    // Wait for dialog to appear
    await waitFor(() => {
      expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    });
    
    // Click Delete Job
    await user.click(screen.getByText('Delete Job'));
    
    // Check if deletePostedJob was called
    await waitFor(() => {
      expect(mockDeletePostedJob).toHaveBeenCalledWith(123);
    });
    
    // Check if success message is shown
    await waitFor(() => {
      expect(screen.getByTestId('mock-snackbar')).toBeInTheDocument();
      expect(screen.getByTestId('mock-alert-success')).toBeInTheDocument();
      expect(screen.getByText(/was successfully deleted/)).toBeInTheDocument();
    });
  }, 10000);

  it('handles API errors when deleting job', async () => {
    // Mock deletePostedJob to reject
    (mockDeletePostedJob as jest.Mock).mockRejectedValueOnce(new Error('Failed to delete'));
    
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<JobCard {...mockJob} onDelete={mockOnDelete} />);
    
    // Open delete dialog
    const deleteButton = screen.getByTestId('DeleteIcon').closest('button');
    await user.click(deleteButton!);
    
    // Wait for dialog to appear
    await waitFor(() => {
      expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    });
    
    // Click Delete Job
    await user.click(screen.getByText('Delete Job'));
    
    // Check if error is logged
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error deleting job:', expect.any(Error));
      expect(screen.getByTestId('mock-snackbar')).toBeInTheDocument();
      expect(screen.getByTestId('mock-alert-success')).toBeInTheDocument();
      expect(screen.getByText('Failed to delete job. Please try again.')).toBeInTheDocument();
    });
  }, 10000);

  it('behaves differently for saved jobs vs posted jobs', () => {
    // Render with Saved status
    const savedJob = { ...mockJob, status: 'Saved' as const };
    render(<JobCard {...savedJob} onDelete={mockOnDelete} />);
    
    // Check that View Applications and Edit buttons are not present
    expect(screen.queryByText('View Applications')).not.toBeInTheDocument();
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    
    // Check that status chip shows Saved
    expect(screen.getByText('Saved')).toBeInTheDocument();
    
    // Click the card and check if router was called (different behavior than for posted jobs)
    fireEvent.click(screen.getByText('Software Engineer'));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/apply?'));
  });

  it('formats salary correctly for different scenarios', async () => {
    // Test min only salary
    const minOnlyJob = { ...mockJob, salary_max_range: null };
    render(<JobCard {...minOnlyJob} onDelete={mockOnDelete} />);
    
    // Click to open details modal
    fireEvent.click(screen.getByText('Software Engineer'));
    
    // Check if salary is formatted correctly
    expect(screen.getByText('From $70,000')).toBeInTheDocument();
    
    // Clean up
    fireEvent.click(screen.getByText('Close'));
  });
  
  it('formats salary for max only case', async () => {
    // Test max only salary
    const maxOnlyJob = { ...mockJob, salary_min_range: null };
    render(<JobCard {...maxOnlyJob} onDelete={mockOnDelete} />);
    
    // Click to open details modal
    fireEvent.click(screen.getByText('Software Engineer'));
    
    // Check if salary is formatted correctly
    expect(screen.getByText('Up to $100,000')).toBeInTheDocument();
    
    // Clean up
    fireEvent.click(screen.getByText('Close'));
  });
  
  it('formats salary for no salary case', async () => {
    // Test no salary
    const noSalaryJob = { ...mockJob, salary_min_range: null, salary_max_range: null };
    render(<JobCard {...noSalaryJob} onDelete={mockOnDelete} />);
    
    // Click to open details modal
    fireEvent.click(screen.getByText('Software Engineer'));
    
    // Check if salary is formatted correctly
    expect(screen.getByText('Not specified')).toBeInTheDocument();
  });
});