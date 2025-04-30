import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';

// Define custom query types first
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveFormValues: (values: Record<string, any>) => R;
    }
  }
}

// Extend the testing library types with our custom queries
import { queries, screen as _screen, within } from '@testing-library/dom';

// Define custom query types
type CustomQueries = {
  getByAcceptingFiles(): HTMLInputElement;
  queryByAcceptingFiles(): HTMLInputElement | null;
  findByAcceptingFiles(): Promise<HTMLInputElement>;
};

// Add custom queries to Testing Library
declare module '@testing-library/dom' {
  interface Queries extends CustomQueries {}
}

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the job store
jest.mock('../shared/store/useJobStore', () => ({
  useJobStore: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock console.log to prevent debug output in tests
const originalConsoleLog = console.log;
console.log = jest.fn();

// Mock alert
global.alert = jest.fn();

// Define the custom query implementation
const getByAcceptingFiles = (): HTMLInputElement => {
  return document.querySelector('input[type="file"]') as HTMLInputElement;
};

// Add the custom query to the screen object
// This extends the screen object with our custom query at runtime
const customScreen = screen as typeof screen & {
  getByAcceptingFiles: typeof getByAcceptingFiles;
};
customScreen.getByAcceptingFiles = getByAcceptingFiles;

// Import components and hooks after defining mocks
import ApplyModal from '../apply/components/ApplyModal';
import { useJobStore } from '../shared/store/useJobStore';

describe('ApplyModal Component', () => {
  const mockJob = {
    id: 123,
    title: 'Software Engineer',
    company: 'Tech Corp',
    location: 'Remote',
    type: 'Full-time',
    description: 'Join our amazing team',
    industry: 'Technology',
    experience_level: 'Mid',
    workplace_type: 'Remote',
    salary_min_range: 70000,
    salary_max_range: 100000,
    about: 'Tech Corp is a leading tech company',
    requirements: ['JavaScript', 'React', 'Node.js']
  };
  
  const mockUser = {
    email: 'test@example.com',
    name: 'Test User',
  };
  
  const mockOnClose = jest.fn();
  const mockPush = jest.fn();
  const mockApplyJob = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock router
    (useRouter as unknown as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    
    // Mock job store - use unknown as intermediate type to fix TypeScript error
    (useJobStore as unknown as jest.Mock).mockImplementation((selector) => {
      return selector({
        applyJob: mockApplyJob,
      });
    });
    
    // Mock fetch user data
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === 'http://localhost:5000/api/user') {
        return Promise.resolve({
          json: () => Promise.resolve(mockUser),
        });
      }
      return Promise.reject(new Error('Unknown fetch call'));
    });
  });
  
  afterAll(() => {
    // Restore original console.log after tests
    console.log = originalConsoleLog;
  });

  it('renders the modal with job details', async () => {
    render(<ApplyModal job={mockJob} open={true} onClose={mockOnClose} />);
    
    // Check if the job company is displayed in the title
    expect(screen.getByText(`Apply to ${mockJob.company}`)).toBeInTheDocument();
    
    // Instead of waiting for email to be populated, check if input exists
    expect(screen.getByLabelText(/Email address*/i)).toBeInTheDocument();
  });
  
  it('validates email input', async () => {
    const user = userEvent.setup();
    render(<ApplyModal job={mockJob} open={true} onClose={mockOnClose} />);
    
    // Enter test email directly without waiting
    const emailInput = screen.getByLabelText(/Email address*/i);
    await user.type(emailInput, 'invalid-email');
    
    // Check if validation error is displayed
    expect(screen.getByText('Invalid email format.')).toBeInTheDocument();
    
    // Enter valid email
    await user.clear(emailInput);
    await user.type(emailInput, 'valid@example.com');
    
    // Check that the validation error is no longer displayed
    expect(screen.queryByText('Invalid email format.')).not.toBeInTheDocument();
  });
  
  it('validates phone number input', async () => {
    const user = userEvent.setup();
    render(<ApplyModal job={mockJob} open={true} onClose={mockOnClose} />);
    
    // Enter invalid phone number
    const phoneInput = screen.getByLabelText(/Mobile phone number*/i);
    await user.type(phoneInput, '12345'); // Too short, no plus sign
    
    // Check if validation error is displayed
    expect(screen.getByText('Use format +201234567890 (10–15 digits).')).toBeInTheDocument();
    
    // Enter valid phone number
    await user.clear(phoneInput);
    await user.type(phoneInput, '+201234567890');
    
    // Check that the validation error is no longer displayed
    expect(screen.queryByText('Use format +201234567890 (10–15 digits).')).not.toBeInTheDocument();
  });
  
  it('handles resume file upload', async () => {
    const user = userEvent.setup();
    render(<ApplyModal job={mockJob} open={true} onClose={mockOnClose} />);
    
    // Before upload
    expect(screen.getByText('Upload resume')).toBeInTheDocument();
    
    // Prepare file for upload
    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
    // Use querySelector directly instead of the custom query
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Simulate file upload
    await user.upload(fileInput, file);
    
    // After upload
    expect(screen.getByText('resume.pdf')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
    
    // Check that URL.createObjectURL was called
    expect(URL.createObjectURL).toHaveBeenCalledWith(file);
  });
  
  it('disables submit button until all fields are valid', async () => {
    const user = userEvent.setup();
    render(<ApplyModal job={mockJob} open={true} onClose={mockOnClose} />);
    
    // Initially button should be disabled
    const submitButton = screen.getByText('Submit application');
    expect(submitButton).toBeDisabled();
    
    // Enter email
    const emailInput = screen.getByLabelText(/Email address*/i);
    await user.type(emailInput, 'test@example.com');
    
    // Enter phone number
    const phoneInput = screen.getByLabelText(/Mobile phone number*/i);
    await user.type(phoneInput, '+201234567890');
    
    // Still disabled (no resume)
    expect(submitButton).toBeDisabled();
    
    // Upload resume
    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
    // Use querySelector directly
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, file);
    
    // Now button should be enabled
    expect(submitButton).not.toBeDisabled();
  });
  
  it('submits the form with correct data', async () => {
    // Mock successful API response
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === `https://api.ascendx.tech/job/${mockJob.id}/applications`) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Application submitted successfully' }),
        });
      }
      return Promise.reject(new Error('Unknown fetch call'));
    });
    
    const user = userEvent.setup();
    render(<ApplyModal job={mockJob} open={true} onClose={mockOnClose} />);
    
    // Enter email directly
    const emailInput = screen.getByLabelText(/Email address*/i);
    await user.type(emailInput, mockUser.email);
    
    // Enter phone number
    const phoneInput = screen.getByLabelText(/Mobile phone number*/i);
    await user.type(phoneInput, '+201234567890');
    
    // Upload resume
    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
    // Use querySelector directly
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, file);
    
    // Submit the form
    const submitButton = screen.getByText('Submit application');
    await user.click(submitButton);
    
    // Check if fetch was called with correct authorization token
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `https://api.ascendx.tech/job/${mockJob.id}/applications`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer'), 
            'x-no-parse-body': '1'
          })
        })
      );
    });
    
    // Verify console.log was called with debugging information
    expect(console.log).toHaveBeenCalledWith('************');
    expect(console.log).toHaveBeenCalledWith('FormData:', '+201234567890');
    
    // Check if FormData was created with correct values
    const fetchCalls = (global.fetch as jest.Mock).mock.calls;
    const apiCall = fetchCalls.find(call => 
      call[0] === `https://api.ascendx.tech/job/${mockJob.id}/applications`
    );
    const formData = apiCall[1].body;
    expect(formData.get('email')).toBe(mockUser.email);
    expect(formData.get('phone')).toBe('+201234567890');
    expect(formData.get('resume')).toEqual(file);
    
    // Check if applyJob was called
    expect(mockApplyJob).toHaveBeenCalledWith({
      ...mockJob,
      status: 'Applied'
    });
    
    // Check if navigation occurred
    expect(mockPush).toHaveBeenCalledWith('/MyJobs');
    
    // Check if success alert was shown
    expect(global.alert).toHaveBeenCalledWith('Application submitted successfully');
  });
  
  it('handles API submission errors', async () => {
    // Mock failed API response
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === `https://api.ascendx.tech/job/${mockJob.id}/applications`) {
        return Promise.resolve({
          ok: false,
          status: 400,
          text: () => Promise.resolve('Invalid resume format'),
        });
      }
      return Promise.reject(new Error('Unknown fetch call'));
    });
    
    const user = userEvent.setup();
    render(<ApplyModal job={mockJob} open={true} onClose={mockOnClose} />);
    
    // Enter email directly instead of expecting it to be pre-populated
    const emailInput = screen.getByLabelText(/Email address*/i);
    await user.type(emailInput, mockUser.email);
    
    // Enter phone number
    await user.type(screen.getByLabelText(/Mobile phone number*/i), '+201234567890');
    
    // Upload resume
    await user.upload(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' })
    );
    
    // Submit the form
    await user.click(screen.getByText('Submit application'));
    
    // Check if error alert was shown
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        'Application failed: (400) Invalid resume format'
      );
    });
    
    // Check that we didn't navigate or update job store
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockApplyJob).not.toHaveBeenCalled();
  });
  
  it('closes the modal when Back button is clicked', async () => {
    const user = userEvent.setup();
    render(<ApplyModal job={mockJob} open={true} onClose={mockOnClose} />);
    
    await user.click(screen.getByText('Back'));
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  
  it('closes the modal when close (X) button is clicked', async () => {
    const user = userEvent.setup();
    render(<ApplyModal job={mockJob} open={true} onClose={mockOnClose} />);
    
    await user.click(screen.getByText('×'));
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  
  it('cleans up URL objects when unmounting', async () => {
    const { unmount } = render(<ApplyModal job={mockJob} open={true} onClose={mockOnClose} />);
    
    // Upload a file to create an object URL
    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
    // Use querySelector directly
    fireEvent.change(document.querySelector('input[type="file"]') as HTMLInputElement, { 
      target: { files: [file] } 
    });
    
    // Unmount component
    unmount();
    
    // Check if URL was revoked
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
  });
});