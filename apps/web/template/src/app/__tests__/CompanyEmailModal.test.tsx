import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CompanyEmailModal from '../JobPosting/components/CompanyEmailModal';

describe('CompanyEmailModal Component', () => {
  // Mock the props we'll pass to the component
  const mockOnClose = jest.fn();
  const mockOnVerify = jest.fn();
  const companyName = "AcmeInc";
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with the correct title and company name', () => {
    render(
      <CompanyEmailModal 
        companyName={companyName} 
        onClose={mockOnClose} 
        onVerify={mockOnVerify}
      />
    );
    
    // Check if dialog title is rendered
    expect(screen.getByText('Verify Company Email')).toBeInTheDocument();
    
    // Check if company name is included in the instruction text
    expect(screen.getByText(/Please enter your company email to verify you work at/)).toBeInTheDocument();
    expect(screen.getByText('AcmeInc')).toBeInTheDocument();
    
    // Check if the email input field is present
    expect(screen.getByLabelText('Company Email')).toBeInTheDocument();
    
    // Check if buttons are present
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Verify' })).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(
      <CompanyEmailModal 
        companyName={companyName} 
        onClose={mockOnClose} 
        onVerify={mockOnVerify}
      />
    );
    
    // Click the Cancel button
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    
    // Verify onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    // Verify onVerify was NOT called
    expect(mockOnVerify).not.toHaveBeenCalled();
  });

  it('validates the email domain correctly and calls onVerify on success', () => {
    render(
      <CompanyEmailModal 
        companyName={companyName} 
        onClose={mockOnClose} 
        onVerify={mockOnVerify}
      />
    );
    
    // Get the email input field
    const emailInput = screen.getByLabelText('Company Email');
    
    // Enter a valid email (matches company domain)
    fireEvent.change(emailInput, { target: { value: 'test@acmeinc.com' } });
    
    // Click the Verify button
    fireEvent.click(screen.getByRole('button', { name: 'Verify' }));
    
    // Verify onVerify was called with the correct email
    expect(mockOnVerify).toHaveBeenCalledWith('test@acmeinc.com');
    
    // Verify onClose was called (to close the modal after successful verification)
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('shows error message when email domain is invalid', () => {
    render(
      <CompanyEmailModal 
        companyName={companyName} 
        onClose={mockOnClose} 
        onVerify={mockOnVerify}
      />
    );
    
    // Get the email input field
    const emailInput = screen.getByLabelText('Company Email');
    
    // Enter an invalid email (wrong domain)
    fireEvent.change(emailInput, { target: { value: 'test@wrongdomain.com' } });
    
    // Click the Verify button
    fireEvent.click(screen.getByRole('button', { name: 'Verify' }));
    
    // Verify error message is displayed
    expect(screen.getByText('Email must end with @acmeinc.com')).toBeInTheDocument();
    
    // Verify onVerify was NOT called
    expect(mockOnVerify).not.toHaveBeenCalled();
    
    // Verify onClose was NOT called
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('handles companies with spaces in their name correctly', () => {
    // Render with a company name containing spaces
    render(
      <CompanyEmailModal 
        companyName="Tech Solutions" 
        onClose={mockOnClose} 
        onVerify={mockOnVerify}
      />
    );
    
    // Get the email input field
    const emailInput = screen.getByLabelText('Company Email');
    
    // Enter a valid email based on the company name with spaces removed
    fireEvent.change(emailInput, { target: { value: 'test@techsolutions.com' } });
    
    // Click the Verify button
    fireEvent.click(screen.getByRole('button', { name: 'Verify' }));
    
    // Verify onVerify was called with the correct email
    expect(mockOnVerify).toHaveBeenCalledWith('test@techsolutions.com');
    
    // Verify onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('clears error message when user corrects the email', async () => {
    render(
      <CompanyEmailModal 
        companyName={companyName} 
        onClose={mockOnClose} 
        onVerify={mockOnVerify}
      />
    );
    
    // Get the email input field
    const emailInput = screen.getByLabelText('Company Email');
    
    // First enter an invalid email
    fireEvent.change(emailInput, { target: { value: 'test@wrongdomain.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Verify' }));
    
    // Verify error message is displayed
    expect(screen.getByText('Email must end with @acmeinc.com')).toBeInTheDocument();
    
    // Now correct the email
    fireEvent.change(emailInput, { target: { value: 'test@acmeinc.com' } });
    
    // Error message should still be there until form is submitted again
    expect(screen.getByText('Email must end with @acmeinc.com')).toBeInTheDocument();
    
    // Submit the form again with correct email
    fireEvent.click(screen.getByRole('button', { name: 'Verify' }));
    
    // Verify onVerify was called with the correct email
    expect(mockOnVerify).toHaveBeenCalledWith('test@acmeinc.com');
    
    // Verify onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});