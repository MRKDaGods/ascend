import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import JobFilter from '../alljobs/components/JobFilter';
import { useJobFilterStore } from '../alljobs/store/useJobFilterStore';

// Mock the job filter store
jest.mock('../alljobs/store/useJobFilterStore', () => ({
  useJobFilterStore: jest.fn(),
}));

describe('JobFilter Component', () => {
  // Mock store values and functions
  const mockSetFilter = jest.fn();
  const mockResetFilters = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup the mock store with default values
    (useJobFilterStore as jest.Mock).mockReturnValue({
      keyword: '',
      location: '',
      industry: '',
      company: '',
      workplace_type: '',
      experience_level: [],
      salary_range_min: 0,
      salary_range_max: 0,
      setFilter: mockSetFilter,
      resetFilters: mockResetFilters,
    });
  });
  
  it('renders all filter fields correctly', () => {
    render(<JobFilter />);
    
    // Check text fields
    expect(screen.getByLabelText('Keyword')).toBeInTheDocument();
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Industry')).toBeInTheDocument();
    expect(screen.getByLabelText('Company')).toBeInTheDocument();
    expect(screen.getByLabelText('Workplace Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Minimum Salary')).toBeInTheDocument();
    expect(screen.getByLabelText('Maximum Salary')).toBeInTheDocument();
    
    // Check experience level checkboxes
    expect(screen.getByText('Experience Level')).toBeInTheDocument();
    expect(screen.getByLabelText('Internship')).toBeInTheDocument();
    expect(screen.getByLabelText('Entry')).toBeInTheDocument();
    expect(screen.getByLabelText('Associate')).toBeInTheDocument();
    expect(screen.getByLabelText('Mid')).toBeInTheDocument();
    expect(screen.getByLabelText('Director')).toBeInTheDocument();
    
    // Check reset button
    expect(screen.getByText('Reset Filters')).toBeInTheDocument();
  });
  
  it('calls setFilter when keyword input changes', async () => {
    render(<JobFilter />);
    
    const keywordInput = screen.getByLabelText('Keyword');
    fireEvent.change(keywordInput, { target: { value: 'developer' } });
    
    expect(mockSetFilter).toHaveBeenCalledWith('keyword', 'developer');
  });
  
  it('calls setFilter when location input changes', async () => {
    render(<JobFilter />);
    
    const locationInput = screen.getByLabelText('Location');
    fireEvent.change(locationInput, { target: { value: 'New York' } });
    
    // Since Autocomplete component handles the change internally
    // we need to wait for the input change to be processed
    await waitFor(() => {
      expect(mockSetFilter).toHaveBeenCalledWith('location', 'New York');
    });
  });
  
  it('calls setFilter when industry input changes', async () => {
    render(<JobFilter />);
    
    const industryInput = screen.getByLabelText('Industry');
    fireEvent.change(industryInput, { target: { value: 'Technology' } });
    
    await waitFor(() => {
      expect(mockSetFilter).toHaveBeenCalledWith('industry', 'Technology');
    });
  });
  
  it('calls setFilter when company input changes', () => {
    render(<JobFilter />);
    
    const companyInput = screen.getByLabelText('Company');
    fireEvent.change(companyInput, { target: { value: 'Google' } });
    
    expect(mockSetFilter).toHaveBeenCalledWith('company', 'Google');
  });
  
  it('calls setFilter when workplace type input changes', async () => {
    render(<JobFilter />);
    
    const workplaceTypeInput = screen.getByLabelText('Workplace Type');
    fireEvent.change(workplaceTypeInput, { target: { value: 'Remote' } });
    
    await waitFor(() => {
      expect(mockSetFilter).toHaveBeenCalledWith('workplace_type', 'Remote');
    });
  });
  
  it('calls setFilter when minimum salary input changes', () => {
    render(<JobFilter />);
    
    const minSalaryInput = screen.getByLabelText('Minimum Salary');
    fireEvent.change(minSalaryInput, { target: { value: '50000' } });
    
    expect(mockSetFilter).toHaveBeenCalledWith('salary_range_min', 50000);
  });
  
  it('calls setFilter when maximum salary input changes', () => {
    render(<JobFilter />);
    
    const maxSalaryInput = screen.getByLabelText('Maximum Salary');
    fireEvent.change(maxSalaryInput, { target: { value: '100000' } });
    
    expect(mockSetFilter).toHaveBeenCalledWith('salary_range_max', 100000);
  });
  
  it('handles experience level checkbox toggles correctly', () => {
    // Mock with one experience level already selected
    (useJobFilterStore as jest.Mock).mockReturnValue({
      keyword: '',
      location: '',
      industry: '',
      company: '',
      workplace_type: '',
      experience_level: ['Entry'], // Entry is already selected
      salary_range_min: 0,
      salary_range_max: 0,
      setFilter: mockSetFilter,
      resetFilters: mockResetFilters,
    });
    
    render(<JobFilter />);
    
    // Check that Entry checkbox is already checked
    const entryCheckbox = screen.getByLabelText('Entry') as HTMLInputElement;
    expect(entryCheckbox.checked).toBe(true);
    
    // Toggle Entry off
    fireEvent.click(entryCheckbox);
    expect(mockSetFilter).toHaveBeenCalledWith('experience_level', []);
    
    // Toggle Mid on
    const midCheckbox = screen.getByLabelText('Mid');
    fireEvent.click(midCheckbox);
    expect(mockSetFilter).toHaveBeenCalledWith('experience_level', ['Entry', 'Mid']);
  });
  
  it('calls resetFilters when reset button is clicked', () => {
    render(<JobFilter />);
    
    const resetButton = screen.getByText('Reset Filters');
    fireEvent.click(resetButton);
    
    expect(mockResetFilters).toHaveBeenCalled();
  });
  
  it('shows selection from dropdowns', async () => {
    // Setup user event for better interaction testing
    const user = userEvent.setup();
    
    render(<JobFilter />);
    
    // Open Location dropdown
    await user.click(screen.getByLabelText('Location'));
    
    // Should show dropdown options
    await waitFor(() => {
      expect(screen.getByText('New York')).toBeInTheDocument();
      expect(screen.getByText('San Francisco')).toBeInTheDocument();
      expect(screen.getByText('London')).toBeInTheDocument();
    });
    
    // Select an option
    await user.click(screen.getByText('New York'));
    
    await waitFor(() => {
      expect(mockSetFilter).toHaveBeenCalledWith('location', 'New York');
    });
  });
  
  it('handles pre-populated filter values correctly', () => {
    // Mock store with pre-populated values
    (useJobFilterStore as jest.Mock).mockReturnValue({
      keyword: 'software',
      location: 'New York',
      industry: 'Technology',
      company: 'Google',
      workplace_type: 'Remote',
      experience_level: ['Entry', 'Mid'],
      salary_range_min: 50000,
      salary_range_max: 100000,
      setFilter: mockSetFilter,
      resetFilters: mockResetFilters,
    });
    
    render(<JobFilter />);
    
    // Check that inputs have the correct pre-populated values
    expect((screen.getByLabelText('Keyword') as HTMLInputElement).value).toBe('software');
    expect((screen.getByLabelText('Company') as HTMLInputElement).value).toBe('Google');
    expect((screen.getByLabelText('Minimum Salary') as HTMLInputElement).value).toBe('50000');
    expect((screen.getByLabelText('Maximum Salary') as HTMLInputElement).value).toBe('100000');
    
    // Check that appropriate checkboxes are checked
    expect((screen.getByLabelText('Entry') as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText('Mid') as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText('Director') as HTMLInputElement).checked).toBe(false);
  });
});