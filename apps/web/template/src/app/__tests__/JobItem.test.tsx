import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobItem from '../alljobs/components/JobItem';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('JobItem Component', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });
  });
  
  const mockJob = {
    job_id: 123,
    title: 'Software Engineer',
    company: 'Tech Corp',
    location: 'New York',
    type: 'Full-time',
    description: 'This is a job description for a software engineer position.',
    experienceLevel: 'Mid-Level',
    salaryRange: '$80,000 - $100,000'
  };
  
  it('renders job information correctly', () => {
    render(<JobItem {...mockJob} />);
    
    // Check if the title is displayed
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    
    // Check if company and location are displayed
    expect(screen.getByText('Tech Corp - New York')).toBeInTheDocument();
    
    // Check if job type is displayed
    expect(screen.getByText(/Full-time/)).toBeInTheDocument();
    
    // Check if experience level is displayed
    expect(screen.getByText(/Mid-Level/)).toBeInTheDocument();
    
    // Check if salary range is displayed
    expect(screen.getByText(/\$80,000 - \$100,000/)).toBeInTheDocument();
    
    // Check if description is displayed
    expect(screen.getByText('This is a job description for a software engineer position.')).toBeInTheDocument();
    
    // Check if Apply Now button is displayed
    expect(screen.getByText('Apply Now')).toBeInTheDocument();
    
    // Check if company initial is displayed in the avatar
    expect(screen.getByText('T')).toBeInTheDocument();
  });
  
  it('displays "Not specified" when salary range is not provided', () => {
    const jobWithoutSalary = { ...mockJob, salaryRange: '' };
    render(<JobItem {...jobWithoutSalary} />);
    
    expect(screen.getByText(/Not specified/)).toBeInTheDocument();
  });
  
  it('navigates to apply page when Apply Now button is clicked', () => {
    render(<JobItem {...mockJob} />);
    
    // Click the Apply Now button
    fireEvent.click(screen.getByText('Apply Now'));
    
    // Check if router.push was called with the correct URL
    expect(mockPush).toHaveBeenCalledTimes(1);
    
    // Updated to match the new URL structure with industry, experience_level, and workplace_type
    const expectedUrl = `/apply?id=123&title=Software+Engineer&company=Tech+Corp&location=New+York&type=Full-time&description=This+is+a+job+description+for+a+software+engineer+position.&industry=&experience_level=Mid-Level&workplace_type=`;
    expect(mockPush).toHaveBeenCalledWith(expectedUrl);
  });
  
  it('handles missing company name gracefully for avatar', () => {
    const jobWithoutCompany = { ...mockJob, company: undefined };
    render(<JobItem {...jobWithoutCompany} />);
    
    // The component should still render without errors
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    
    // The PersonIcon should be used as a fallback when company name is missing
    // Use data-testid to find the PersonIcon in the Avatar component
    expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();
    
    // The company name should not appear in the avatar
    expect(screen.queryByText('T')).not.toBeInTheDocument();
  });
  
  it('renders all job details even with partial data', () => {
    const partialJob = {
      job_id: 456,
      title: 'Frontend Developer',
      company: 'WebCo',
      location: 'Remote',
      // Missing type, experienceLevel, salaryRange, and description
    };
    
    render(<JobItem {...partialJob} />);
    
    // Check that the component renders with partial data
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('WebCo - Remote')).toBeInTheDocument();
    
    // These fields should still be rendered, but with empty or undefined values
    expect(screen.getByText(/Type:/)).toBeInTheDocument();
    expect(screen.getByText(/Experience Level:/)).toBeInTheDocument();
    expect(screen.getByText(/Not specified/)).toBeInTheDocument();
    
    // Check that Apply button still works
    fireEvent.click(screen.getByText('Apply Now'));
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
  
  it('correctly formats query parameters for navigation', () => {
    const jobWithSpecialChars = {
      ...mockJob,
      title: 'Software & Data Engineer',
      description: 'Work with SQL & NoSQL databases!',
    };
    
    render(<JobItem {...jobWithSpecialChars} />);
    
    fireEvent.click(screen.getByText('Apply Now'));
    
    // Check if special characters are properly encoded in URL
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('Software+%26+Data+Engineer'));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('Work+with+SQL+%26+NoSQL+databases%21'));
  });
});