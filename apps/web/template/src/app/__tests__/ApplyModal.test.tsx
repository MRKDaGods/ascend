import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ApplyModal from '../apply/components/ApplyModal';
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

// Mock fetch
global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock alert
global.alert = jest.fn();

describe('ApplyModal Component', () => {
  const mockJob = {
    id: 123,
    title: 'Software Engineer',
    company: 'Tech Corp',
    location: 'Remote',
    type: 'Full-time',
    description: 'Join our amazing team',
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
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    
    // Mock job store
    (useJobStore as jest.Mock).mockImplementation((selector) => {
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
  
  it('renders the modal with job details', async () => {
    render(<ApplyModal job={mockJob} open={true} onClose={mockOnClose} />);
    
    // Check if the job company is displayed in the title
    expect(screen.getByText(`Apply to ${mockJob.company}`)).toBeInTheDocument();
    
    // Wait for user data to be fetched and populated
    await waitFor(() => {
      expect(screen.getByLabelText(/Email address*/i)).toHaveValue(mockUser.email);
    });
  });
  
  it('validates email input', async () => {
    const user = userEvent.setup();
    render(<ApplyModal job={mockJob} open={true} onClose={mockOnClose} />);
    
    // Wait for user data to be populated
    await waitFor(() => {
      expect(screen.getByLabelText(/Email address*/i)).toHaveValue(mockUser.email);
    });
    
    // Enter invalid email
    const emailInput = screen.getByLabelText(/Email address*/i);
    await user.clear(emailInput);
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
    const fileInput = screen.getByAcceptingFiles();
    
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
    
    // Wait for user data to be populated
    await waitFor(() => {
      expect(screen.getByLabelText(/Email address*/i)).toHaveValue(mockUser.email);
    });
    
    // Initially button should be disabled (no phone number and no resume)
    const submitButton = screen.getByText('Submit application');
    expect(submitButton).toBeDisabled();
    
    // Enter phone number
    const phoneInput = screen.getByLabelText(/Mobile phone number*/i);
    await user.type(phoneInput, '+201234567890');
    
    // Still disabled (no resume)
    expect(submitButton).toBeDisabled();
    
    // Upload resume
    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByAcceptingFiles();
    await user.upload(fileInput, file);
    
    // Now button should be enabled
    expect(submitButton).not.toBeDisabled();
  });
  
  it('submits the form with correct data', async () => {
    // Mock successful API response
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === 'http://localhost:5000/api/user') {
        return Promise.resolve({
          json: () => Promise.resolve(mockUser),
        });
      } else if (url === `https://api.ascendx.tech/job/${mockJob.id}/applications`) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Application submitted successfully' }),
        });
      }
      return Promise.reject(new Error('Unknown fetch call'));
    });
    
    const user = userEvent.setup();
    render(<ApplyModal job={mockJob} open={true} onClose={mockOnClose} />);
    
    // Wait for user data to be populated
    await waitFor(() => {
      expect(screen.getByLabelText(/Email address*/i)).toHaveValue(mockUser.email);
    });
    
    // Enter phone number
    const phoneInput = screen.getByLabelText(/Mobile phone number*/i);
    await user.type(phoneInput, '+201234567890');
    
    // Upload resume
    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByAcceptingFiles();
    await user.upload(fileInput, file);
    
    // Submit the form
    const submitButton = screen.getByText('Submit application');
    await user.click(submitButton);
    
    // Check if fetch was called with correct data - Use the actual endpoint from the component
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `https://api.ascendx.tech/job/${mockJob.id}/applications`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer'),  //momken teb2a 3ayza tetshal lama n merge 
            'x-no-parse-body': '1'
          })
        })
      );
    });
    
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
      if (url === 'http://localhost:5000/api/user') {
        return Promise.resolve({
          json: () => Promise.resolve(mockUser),
        });
      } else if (url === `https://api.ascendx.tech/job/${mockJob.id}/applications`) {
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
    
    // Wait for user data to be populated
    await waitFor(() => {
      expect(screen.getByLabelText(/Email address*/i)).toHaveValue(mockUser.email);
    });
    
    // Enter phone number and upload resume
    await user.type(screen.getByLabelText(/Mobile phone number*/i), '+201234567890');
    await user.upload(
      screen.getByAcceptingFiles(),
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
    fireEvent.change(screen.getByAcceptingFiles(), { target: { files: [file] } });
    
    // Unmount component
    unmount();
    
    // Check if URL was revoked
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
  });
});

// Custom matcher for file inputs
function getByAcceptingFiles(): HTMLInputElement {
  return screen.getByAcceptingFiles();
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveFormValues: (values: Record<string, any>) => R;
    }
  }
}

// Add custom queries to Testing Library
declare module '@testing-library/dom' {
  function getByAcceptingFiles(): HTMLInputElement;
  function queryByAcceptingFiles(): HTMLInputElement | null;
  function findByAcceptingFiles(): Promise<HTMLInputElement>;
}

// Add custom query to Testing Library
if (!screen.getByAcceptingFiles) {
  screen.getByAcceptingFiles = () => document.querySelector('input[type="file"]') as HTMLInputElement;
}