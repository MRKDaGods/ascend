import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import JobForm from '../JobPosting/components/JobForm';
import { usepJobStore } from '../JobPosting/store/usepJobStore';
import { useJobStore } from '../shared/store/useJobStore';
import { useIsClient } from '../JobPosting/hooks/useIsClient';
import { useRouter } from 'next/navigation';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn()
  }))
}));

// Mock the necessary dependencies
jest.mock('../JobPosting/store/usepJobStore');
jest.mock('../shared/store/useJobStore');
jest.mock('../JobPosting/hooks/useIsClient');
jest.mock('../JobPosting/components/PostPopUp', () => () => <div data-testid="post-job-popup">Post Job Popup Mock</div>);

// Mock fetch API
global.fetch = jest.fn();
global.alert = jest.fn();

describe('JobForm Component', () => {
  // Define all the mock values and functions
  const mockSetTitle = jest.fn();
  const mockSetCompanyName = jest.fn();
  const mockSetLocation = jest.fn();
  const mockSetDescription = jest.fn();
  const mockSetWorkplaceType = jest.fn();
  const mockSetJobType = jest.fn();
  const mockSetIndustry = jest.fn();
  const mockSetExperienceLevel = jest.fn();
  const mockSetSalaryMin = jest.fn();
  const mockSetSalaryMax = jest.fn();
  const mockSetSavedJobPopupOpen = jest.fn();
  const mockSetPostedJobId = jest.fn();
  const mockSetPostedJob = jest.fn();
  const mockPostJob = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock usepJobStore hook
    (usepJobStore as jest.Mock).mockReturnValue({
      title: 'Software Engineer',
      companyName: 'Acme Inc',
      location: 'New York',
      description: 'Job description text',
      workplaceType: 'Remote',
      jobType: 'Full-time',
      industry: 'Technology',
      experienceLevel: 'MID',
      salaryMin: '50000',
      salaryMax: '80000',
      savedJobPopupOpen: false,
      setTitle: mockSetTitle,
      setCompanyName: mockSetCompanyName,
      setLocation: mockSetLocation,
      setDescription: mockSetDescription,
      setWorkplaceType: mockSetWorkplaceType,
      setJobType: mockSetJobType,
      setIndustry: mockSetIndustry,
      setExperienceLevel: mockSetExperienceLevel,
      setSalaryMin: mockSetSalaryMin,
      setSalaryMax: mockSetSalaryMax,
      setSavedJobPopupOpen: mockSetSavedJobPopupOpen,
      setPostedJobId: mockSetPostedJobId,
      setPostedJob: mockSetPostedJob,
      postedJobId: null,
      postedJob: null,
    });
    
    // Mock useJobStore hook
    (useJobStore as jest.Mock).mockReturnValue({
      postJob: mockPostJob,
    });
    
    // Mock useIsClient hook to return true
    (useIsClient as jest.Mock).mockReturnValue(true);
    
    // Mock successful API response for fetch
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: 123 }),
    });
  });
  
  it('renders the job form with initial values', () => {
    render(<JobForm />);
    
    // Check if the heading is rendered
    expect(screen.getByText('Job details')).toBeInTheDocument();
    
    // Check if form fields are rendered with initial values
    expect(screen.getByLabelText('Job title')).toHaveValue('Software Engineer');
    expect(screen.getByLabelText('Company')).toHaveValue('Acme Inc');
    expect(screen.getByLabelText('Industry')).toHaveValue('Technology');
    
    // For select elements, we can't directly check their values with toHaveValue
    // Instead we'll check that the correct option text is rendered
    expect(screen.getByDisplayValue('MID')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Remote')).toBeInTheDocument();
    expect(screen.getByLabelText('Job location')).toHaveValue('New York');
    expect(screen.getByDisplayValue('Full-time')).toBeInTheDocument();
    
    // For the number fields, convert to string to avoid type issues
    expect(screen.getByLabelText('Min Salary')).toHaveValue('50000');
    expect(screen.getByLabelText('Max Salary')).toHaveValue('80000');
    
    // Check if text area for job description is rendered
    expect(screen.getByPlaceholderText('Add your responsibilities, requirements, and details...')).toHaveValue('Job description text');
    
    // Check if the Post button is rendered
    expect(screen.getByRole('button', { name: 'Post' })).toBeInTheDocument();
  });

  it('updates form fields when values change', async () => {
    render(<JobForm />);
    
    // Update job title
    const titleInput = screen.getByLabelText('Job title');
    fireEvent.change(titleInput, { target: { value: 'Frontend Developer' } });
    expect(mockSetTitle).toHaveBeenCalledWith('Frontend Developer');
    
    // Update company
    const companyInput = screen.getByLabelText('Company');
    fireEvent.change(companyInput, { target: { value: 'Google' } });
    expect(mockSetCompanyName).toHaveBeenCalledWith('Google');
    
    // Update industry
    const industryInput = screen.getByLabelText('Industry');
    fireEvent.change(industryInput, { target: { value: 'Software' } });
    expect(mockSetIndustry).toHaveBeenCalledWith('Software');
    
    // Update location
    const locationInput = screen.getByLabelText('Job location');
    fireEvent.change(locationInput, { target: { value: 'San Francisco' } });
    expect(mockSetLocation).toHaveBeenCalledWith('San Francisco');
    
    // Update min salary
    const minSalaryInput = screen.getByLabelText('Min Salary');
    fireEvent.change(minSalaryInput, { target: { value: '60000' } });
    expect(mockSetSalaryMin).toHaveBeenCalledWith('60000');
    
    // Update max salary
    const maxSalaryInput = screen.getByLabelText('Max Salary');
    fireEvent.change(maxSalaryInput, { target: { value: '90000' } });
    expect(mockSetSalaryMax).toHaveBeenCalledWith('90000');
    
    // Update description
    const descriptionInput = screen.getByPlaceholderText('Add your responsibilities, requirements, and details...');
    fireEvent.change(descriptionInput, { target: { value: 'New description' } });
    expect(mockSetDescription).toHaveBeenCalledWith('New description');
  });

  it('selects options from dropdown menus', () => {
    render(<JobForm />);
    
    // For Material-UI selects, find them by their labels, then get their inner select element
    
    // Test Workplace type select
    const workplaceTypeElement = screen.getByLabelText('Workplace type');
    // We need to access the underlying select element
    const workplaceSelectElement = workplaceTypeElement.querySelector('select') as HTMLSelectElement;
    
    // Mock the direct internal state change 
    // (This is the correct approach for Material-UI selects in tests)
    if (workplaceSelectElement) {
      fireEvent.change(workplaceTypeElement, { target: { value: 'Hybrid' } });
    }
    expect(mockSetWorkplaceType).toHaveBeenCalledWith('Hybrid');
    
    // Test Job type select
    const jobTypeElement = screen.getByLabelText('Job type');
    if (jobTypeElement) {
      fireEvent.change(jobTypeElement, { target: { value: 'Part-time' } });
    }
    expect(mockSetJobType).toHaveBeenCalledWith('Part-time');
    
    // Test Experience Level select
    const experienceLevelElement = screen.getByLabelText('Experience Level');
    if (experienceLevelElement) {
      fireEvent.change(experienceLevelElement, { target: { value: 'Entry' } });
    }
    expect(mockSetExperienceLevel).toHaveBeenCalledWith('Entry');
  });

  it('shows alert when required fields are missing', async () => {
    // Mock empty title
    (usepJobStore as jest.Mock).mockReturnValue({
      title: '',
      companyName: 'Acme Inc',
      description: 'Job description',
      workplaceType: 'Remote',
      jobType: 'Full-time',
      industry: 'Technology',
      experienceLevel: 'MID',
      salaryMin: '50000',
      salaryMax: '80000',
      location: 'New York',
      savedJobPopupOpen: false,
      setTitle: mockSetTitle,
      setCompanyName: mockSetCompanyName,
      setLocation: mockSetLocation,
      setDescription: mockSetDescription,
      setWorkplaceType: mockSetWorkplaceType,
      setJobType: mockSetJobType,
      setIndustry: mockSetIndustry,
      setExperienceLevel: mockSetExperienceLevel,
      setSalaryMin: mockSetSalaryMin,
      setSalaryMax: mockSetSalaryMax,
      setSavedJobPopupOpen: mockSetSavedJobPopupOpen,
      setPostedJobId: mockSetPostedJobId,
      setPostedJob: mockSetPostedJob,
      postedJobId: null,
      postedJob: null,
    });
    
    render(<JobForm />);
    
    // Click post button using fireEvent for more reliable behavior
    fireEvent.click(screen.getByRole('button', { name: 'Post' }));
    
    // Check if alert was called with the correct message
    expect(global.alert).toHaveBeenCalledWith('Title, company name, and description are required.');
    
    // Verify that neither the CompanyEmailModal was opened nor postJob was called
    expect(screen.queryByText('Verify Company Email')).not.toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('opens company email modal when required fields are filled but email is not verified', async () => {
    render(<JobForm />);
    
    // Click post button
    fireEvent.click(screen.getByRole('button', { name: 'Post' }));
    
    // Check if the company email verification modal is displayed
    expect(screen.getByText('Verify Company Email')).toBeInTheDocument();
    expect(screen.getByText(/Please enter your company email to verify you work at/)).toBeInTheDocument();
    expect(screen.getByText('Acme Inc')).toBeInTheDocument();
  });

  it('posts job after email verification', async () => {
    render(<JobForm />);
    
    // Click post button to open email modal
    fireEvent.click(screen.getByRole('button', { name: 'Post' }));
    
    // Enter valid company email
    const emailInput = screen.getByLabelText('Company Email');
    fireEvent.change(emailInput, { target: { value: 'test@acmeinc.com' } });
    
    // Click verify button
    fireEvent.click(screen.getByRole('button', { name: 'Verify' }));
    
    // Check if fetch was called with the correct endpoint and data
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.ascendx.tech/job',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': expect.stringContaining('Bearer')
          }),
          body: expect.stringContaining('"title":"Software Engineer"')
        })
      );
    });
    
    // Check if the success actions were performed
    expect(mockSetPostedJobId).toHaveBeenCalledWith(123);
    expect(mockSetPostedJob).toHaveBeenCalled();
    expect(mockSetSavedJobPopupOpen).toHaveBeenCalledWith(true);
  });

  it('handles API error when posting job', async () => {
    // Mock a failed API response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });
    
    render(<JobForm />);
    
    // Click post button to open email modal
    fireEvent.click(screen.getByRole('button', { name: 'Post' }));
    
    // Enter valid company email
    const emailInput = screen.getByLabelText('Company Email');
    fireEvent.change(emailInput, { target: { value: 'test@acmeinc.com' } });
    
    // Click verify button
    fireEvent.click(screen.getByRole('button', { name: 'Verify' }));
    
    // Check if error is handled correctly
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Failed to post job.');
    });
    
    // Check that the success actions were not performed
    expect(mockSetPostedJobId).not.toHaveBeenCalled();
    expect(mockSetSavedJobPopupOpen).not.toHaveBeenCalled();
  });

  it('does not render when client-side rendering is not ready', () => {
    // Mock useIsClient to return false
    (useIsClient as jest.Mock).mockReturnValue(false);
    
    const { container } = render(<JobForm />);
    
    // Component should not render anything when isClient is false
    expect(container).toBeEmptyDOMElement();
  });
});