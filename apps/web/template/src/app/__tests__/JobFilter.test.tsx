import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import JobFilter from '../alljobs/components/JobFilter';

// Mock MUI Autocomplete for easier testing
jest.mock('@mui/material/Autocomplete', () => {
  return {
    __esModule: true,
    default: jest.fn(({ options, value, onChange, renderInput }) => {
      // Extract label from renderInput params for display
      const params = {};
      const renderedInput = renderInput(params);
      const label = renderedInput.props.label;
      
      // Convert label to kebab case for data-testid
      const labelId = label.toLowerCase().replace(/\s+/g, '-');
      
      return (
        <div className="mock-autocomplete" data-testid={`autocomplete-${labelId}`}>
          {renderInput({
            ...params,
            inputProps: {
              'data-testid': `${labelId}-input`,
              'aria-label': label,
            }
          })}
          <ul>
            {options.map((option: string) => (
              <li 
                key={option} 
                data-testid={`${labelId}-option-${option.toLowerCase().replace(/\s/g, '-')}`}
                onClick={() => onChange({}, option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      );
    })
  };
});

// Mock the job filter store - import it after mocking
jest.mock('../alljobs/store/useJobFilterStore', () => ({
  useJobFilterStore: jest.fn(),
}));

// Import after mocking to get the mocked version
import { useJobFilterStore } from '../alljobs/store/useJobFilterStore';

// Add these to make TypeScript aware of the constants used in tests
const workplaceTypes = ['Remote', 'On-site', 'Hybrid'];
const locations = ['New York', 'San Francisco', 'London'];

describe('JobFilter Component', () => {
  // Mock store values and functions
  const mockSetFilter = jest.fn();
  const mockResetFilters = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup the mock store with default values - use type assertion to fix TypeScript error
    (useJobFilterStore as unknown as jest.Mock).mockReturnValue({
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
    
    // Check experience level section - updated to match new text
    expect(screen.getByText('Experience:')).toBeInTheDocument();
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
    
    // Get the location option and click it directly
    const locationOption = screen.getByTestId('location-option-new-york');
    fireEvent.click(locationOption);
    
    // Verify the mock was called correctly
    expect(mockSetFilter).toHaveBeenCalledWith('location', 'New York');
  });
  
  it('calls setFilter when industry input changes', async () => {
    render(<JobFilter />);
    
    const industryInput = screen.getByLabelText('Industry');
    fireEvent.change(industryInput, { target: { value: 'Technology' } });
    
    expect(mockSetFilter).toHaveBeenCalledWith('industry', 'Technology');
  });
  
  it('calls setFilter when company input changes', () => {
    render(<JobFilter />);
    
    const companyInput = screen.getByLabelText('Company');
    fireEvent.change(companyInput, { target: { value: 'Google' } });
    
    expect(mockSetFilter).toHaveBeenCalledWith('company', 'Google');
  });
  
  it('calls setFilter when workplace type input changes', async () => {
    render(<JobFilter />);
    
    // Get the workplace type option with the correct data-testid 
    // It should be workplace-type-option-remote instead of workplace_type-option-remote
    const remoteOption = screen.getByTestId('workplace-type-option-remote');
    fireEvent.click(remoteOption);
    
    // Verify the mock was called correctly
    expect(mockSetFilter).toHaveBeenCalledWith('workplace_type', 'Remote');
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
  
  it('handles experience level checkbox toggles correctly', async () => {
    // Mock with one experience level already selected
    (useJobFilterStore as unknown as jest.Mock).mockReturnValue({
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
    
    // Toggle Mid on (with a separate test to avoid confusion with previous state)
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
  
  it('handles pre-populated filter values correctly', () => {
    // Mock store with pre-populated values
    (useJobFilterStore as unknown as jest.Mock).mockReturnValue({
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

  it('handles empty salary values correctly', () => {
    // Mock with empty salary values
    (useJobFilterStore as unknown as jest.Mock).mockReturnValue({
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
    
    render(<JobFilter />);
    
    // Salary inputs should be empty strings when value is 0
    expect((screen.getByLabelText('Minimum Salary') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText('Maximum Salary') as HTMLInputElement).value).toBe('');
    
    // Test setting salary to 0 explicitly
    const minSalaryInput = screen.getByLabelText('Minimum Salary');
    fireEvent.change(minSalaryInput, { target: { value: '0' } });
    expect(mockSetFilter).toHaveBeenCalledWith('salary_range_min', 0);
  });

  it('handles autocomplete option selection for workplace type', () => {
    render(<JobFilter />);
    
    // Find and click the Hybrid option directly using our mock implementation
    // Use workplace-type instead of workplace_type in the testid
    const hybridOption = screen.getByTestId('workplace-type-option-hybrid');
    fireEvent.click(hybridOption);
    
    expect(mockSetFilter).toHaveBeenCalledWith('workplace_type', 'Hybrid');
  });
});