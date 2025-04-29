import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobList from '../components/JobsList';
import { useRouter } from 'next/navigation';
import { fetchJobs } from '../lib/api';
import { useDeletedJobsStore } from '../store/useDeletedJobsStore';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock zustand store
jest.mock('../store/useDeletedJobsStore', () => ({
  useDeletedJobsStore: jest.fn(),
}));

// Mock fetchJobs API
jest.mock('../lib/api', () => ({
  fetchJobs: jest.fn(),
}));

// Mock window.alert
window.alert = jest.fn();

// Mock fetch API
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
) as jest.Mock;

describe('JobList Component', () => {
  const mockPush = jest.fn();
  const mockDeleteJob = jest.fn();
  const mockLoadDeletedJobs = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    // Setup zustand store mock with type assertion to fix TypeScript errors
    (useDeletedJobsStore as unknown as jest.Mock).mockReturnValue({
      deletedJobIds: [],
      deleteJob: mockDeleteJob,
      loadDeletedJobs: mockLoadDeletedJobs,
    });

    // Setup API mock data
    (fetchJobs as jest.Mock).mockResolvedValue({
      data: [
        {
          job_id: 1,
          title: 'Frontend Developer',
          description: 'Build amazing UIs.',
          industry: 'Software',
          type: 'Full-time',
          experience_level: 'Junior',
          location: 'Remote',
          workplace_type: 'Remote',
          salary_min_range: 50000,
          salary_max_range: 70000,
          company_id: 101,
          company_name: 'Tech Corp',
          company_logo_url: 'https://via.placeholder.com/150',
          created_at: new Date(),
        },
      ],
    });
  });

  it('renders job items correctly', async () => {
    render(<JobList />);

    // Check the heading is rendered
    expect(screen.getByText('All Available Jobs')).toBeInTheDocument();

    // Wait for async data to load
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
      expect(screen.getByText('Tech Corp - Remote (Full-time)')).toBeInTheDocument();
    });
    
    // Verify that loadDeletedJobs was called on component mount
    expect(mockLoadDeletedJobs).toHaveBeenCalledTimes(1);
  });

  it('navigates to apply page when job title is clicked', async () => {
    render(<JobList />);

    // Wait for job to be rendered
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    });

    // Click on job title
    await act(async () => {
      fireEvent.click(screen.getByText('Frontend Developer'));
    });

    // Check router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/apply?'));
    // Check that URL parameters are correctly formatted
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('title=Frontend+Developer'));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('company=Tech+Corp'));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('id=1'));
  });

  it('handles job deletion', async () => {
    render(<JobList />);

    // Wait for job to be rendered
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    });

    // Find delete button (close icon)
    const closeButton = screen.getByTestId('CloseIcon').closest('button');
    expect(closeButton).not.toBeNull();
    
    await act(async () => {
      fireEvent.click(closeButton!);
    });

    // Check deleteJob was called with job_id
    expect(mockDeleteJob).toHaveBeenCalledWith(1);
  });

  it('opens report dialog when report icon is clicked', async () => {
    render(<JobList />);

    // Wait for job to be rendered
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    });

    // Find and click the report button using the ReportIcon
    const reportButton = screen.getByTestId('ReportIcon').closest('button');
    expect(reportButton).not.toBeNull();
    
    await act(async () => {
      fireEvent.click(reportButton!);
    });

    // Check dialog is shown
    expect(screen.getByText('Report Job')).toBeInTheDocument();
    expect(screen.getByLabelText('Reason for Report')).toBeInTheDocument();
  });

  it('handles job reporting', async () => {
    render(<JobList />);

    // Wait for job to be rendered
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    });

    // Open report dialog
    const reportButton = screen.getByTestId('ReportIcon').closest('button');
    await act(async () => {
      fireEvent.click(reportButton!);
    });

    // Enter report reason
    const reasonInput = screen.getByLabelText('Reason for Report');
    await act(async () => {
      fireEvent.change(reasonInput, { target: { value: 'This is inappropriate' } });
    });

    // Submit report
    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    // Check that fetch was called with the right URL and data
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.ascendx.tech/job/1/report',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ reason: 'This is inappropriate' }),
      })
    );
    
    // Verify alert was called for successful submission
    expect(window.alert).toHaveBeenCalledWith('Report submitted successfully.');
  });
  
  it('shows error when reporting with empty reason', async () => {
    render(<JobList />);

    // Wait for job to be rendered
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    });

    // Open report dialog
    const reportButton = screen.getByTestId('ReportIcon').closest('button');
    await act(async () => {
      fireEvent.click(reportButton!);
    });

    // Submit without entering a reason
    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    // Check that alert was shown for empty reason
    expect(window.alert).toHaveBeenCalledWith('Please provide a valid reason for reporting.');
    // Verify fetch was not called
    expect(global.fetch).not.toHaveBeenCalled();
  });
  
  it('filters out deleted jobs', async () => {
    // Mock with one deleted job ID
    (useDeletedJobsStore as unknown as jest.Mock).mockReturnValue({
      deletedJobIds: [1], // Job ID 1 is "deleted"
      deleteJob: mockDeleteJob,
      loadDeletedJobs: mockLoadDeletedJobs,
    });
    
    // Add a second job to the API response
    (fetchJobs as jest.Mock).mockResolvedValue({
      data: [
        {
          job_id: 1, // This job should be filtered out
          title: 'Frontend Developer',
          company_name: 'Tech Corp',
          location: 'Remote',
          type: 'Full-time',
        },
        {
          job_id: 2, // This job should remain
          title: 'Backend Developer',
          company_name: 'Code Inc',
          location: 'San Francisco',
          type: 'Full-time',
        }
      ],
    });
    
    render(<JobList />);
    
    // Should not find the deleted job
    await waitFor(() => {
      expect(screen.queryByText('Frontend Developer')).not.toBeInTheDocument();
      // But should find the non-deleted job
      expect(screen.getByText('Backend Developer')).toBeInTheDocument();
    });
  });
  
  it('navigates to all jobs page when "Show more" is clicked', async () => {
    render(<JobList />);
    
    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText('Show more →')).toBeInTheDocument();
    });
    
    // Click "Show more"
    fireEvent.click(screen.getByText('Show more →'));
    
    // Check router navigation
    expect(mockPush).toHaveBeenCalledWith('/alljobs');
  });
});
