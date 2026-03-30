import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApplicationCard from '../components/ApplicationCard';

describe('ApplicationCard Component', () => {
  const mockOnUpdateStatus = jest.fn();
  
  const mockApplication = {
    application_id: 123,
    status: 'Pending' as const,
    resume_url: 'https://example.com/resume.pdf',
    created_at: '2023-07-15T12:00:00Z',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    name: 'John Doe',
    profile_photo_url: 'https://example.com/profile.jpg'
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders applicant information correctly', () => {
    render(<ApplicationCard application={mockApplication} onUpdateStatus={mockOnUpdateStatus} />);
    
    // Check if applicant name is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    // Check if status chip is displayed
    expect(screen.getByText('Pending')).toBeInTheDocument();
    
    // Check if contact information is displayed
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('+1234567890')).toBeInTheDocument();
    
    // Check if application date is displayed
    const formattedDate = new Date(mockApplication.created_at).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    expect(screen.getByText(`Applied on ${formattedDate}`)).toBeInTheDocument();
    
    // Check if resume link is displayed
    const resumeLink = screen.getByText('View Resume');
    expect(resumeLink).toBeInTheDocument();
    expect(resumeLink.closest('a')).toHaveAttribute('href', 'https://example.com/resume.pdf');
  });
  
  it('displays fallback avatar when profile photo is not provided', () => {
    const applicationWithoutPhoto = {
      ...mockApplication,
      profile_photo_url: undefined
    };
    
    render(<ApplicationCard application={applicationWithoutPhoto} onUpdateStatus={mockOnUpdateStatus} />);
    
    // Check if PersonIcon is displayed as fallback
    expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();
  });
  
  it('displays email username when name is not provided', () => {
    const applicationWithoutName = {
      ...mockApplication,
      name: undefined
    };
    
    render(<ApplicationCard application={applicationWithoutName} onUpdateStatus={mockOnUpdateStatus} />);
    
    // Should display the username part of the email
    expect(screen.getByText('john.doe')).toBeInTheDocument();
  });
  
  it('does not show resume link when resume_url is null', () => {
    const applicationWithoutResume = {
      ...mockApplication,
      resume_url: null
    };
    
    render(<ApplicationCard application={applicationWithoutResume} onUpdateStatus={mockOnUpdateStatus} />);
    
    // Resume link should not be present
    expect(screen.queryByText('View Resume')).not.toBeInTheDocument();
  });
  
  it('does not show phone when phone is empty', () => {
    const applicationWithoutPhone = {
      ...mockApplication,
      phone: ''
    };
    
    render(<ApplicationCard application={applicationWithoutPhone} onUpdateStatus={mockOnUpdateStatus} />);
    
    // Phone number should not be present
    expect(screen.queryByText('+1234567890')).not.toBeInTheDocument();
  });
  
  it('calls onUpdateStatus with correct arguments when status buttons are clicked', () => {
    render(<ApplicationCard application={mockApplication} onUpdateStatus={mockOnUpdateStatus} />);
    
    // Click on the "Mark as Viewed" button
    fireEvent.click(screen.getByText('Mark as Viewed'));
    expect(mockOnUpdateStatus).toHaveBeenCalledWith(123, 'Viewed');
    
    // Click on the "Accept" button
    fireEvent.click(screen.getByText('Accept'));
    expect(mockOnUpdateStatus).toHaveBeenCalledWith(123, 'Accepted');
    
    // Click on the "Reject" button
    fireEvent.click(screen.getByText('Reject'));
    expect(mockOnUpdateStatus).toHaveBeenCalledWith(123, 'Rejected');
  });
  
  it('disables the corresponding button when the status matches', () => {
    const viewedApplication = {
      ...mockApplication,
      status: 'Viewed' as const
    };
    
    render(<ApplicationCard application={viewedApplication} onUpdateStatus={mockOnUpdateStatus} />);
    
    // "Mark as Viewed" button should be disabled
    expect(screen.getByText('Mark as Viewed')).toBeDisabled();
    
    // Other buttons should be enabled
    expect(screen.getByText('Accept')).not.toBeDisabled();
    expect(screen.getByText('Reject')).not.toBeDisabled();
  });
  
  it('applies correct color to status chip based on status', () => {
    const acceptedApplication = {
      ...mockApplication,
      status: 'Accepted' as const
    };
    
    render(<ApplicationCard application={acceptedApplication} onUpdateStatus={mockOnUpdateStatus} />);
    
    // The Accepted status should have success color
    const statusChip = screen.getByText('Accepted').closest('.MuiChip-root');
    expect(statusChip).toHaveClass('MuiChip-colorSuccess');
  });
});