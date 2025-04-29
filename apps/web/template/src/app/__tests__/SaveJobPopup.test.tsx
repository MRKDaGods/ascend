import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import SaveJobPopup from '../apply/components/SaveJobPopup';
import { useJobStore } from '../shared/store/useJobStore';

// Mock the next/navigation hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the useJobStore
jest.mock('@/app/shared/store/useJobStore', () => ({
  useJobStore: jest.fn(),
}));

describe('SaveJobPopup Component', () => {
  const mockSetSavedJobPopupOpen = jest.fn();
  const mockRouter = { push: jest.fn() };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock router
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    
    // Default: popup is open
    (useJobStore as jest.Mock).mockReturnValue({
      savedJobPopupOpen: true,
      setSavedJobPopupOpen: mockSetSavedJobPopupOpen,
    });
  });

  it('renders correctly when open', () => {
    render(<SaveJobPopup />);
    
    // Check if the popup content is rendered
    expect(screen.getByText(/Post successful/i)).toBeInTheDocument();
    expect(screen.getByText(/View saved posts/i)).toBeInTheDocument();
    
    // Use the test ID to find the close button instead of role
    const closeIcon = screen.getByTestId('CloseIcon');
    expect(closeIcon).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    // Override the default mock to set savedJobPopupOpen to false
    (useJobStore as jest.Mock).mockReturnValue({
      savedJobPopupOpen: false,
      setSavedJobPopupOpen: mockSetSavedJobPopupOpen,
    });
    
    render(<SaveJobPopup />);
    
    // The popup content should not be in the document when closed
    expect(screen.queryByText(/Post successful/i)).not.toBeInTheDocument();
  });

  it('closes when the close button is clicked', () => {
    render(<SaveJobPopup />);
    
    // Find the button containing the CloseIcon by looking at the parent of the SVG
    const closeButton = screen.getByTestId('CloseIcon').closest('button');
    expect(closeButton).not.toBeNull();
    
    // Click the close button
    if (closeButton) {
      fireEvent.click(closeButton);
    }
    
    // Check if setSavedJobPopupOpen was called with false
    expect(mockSetSavedJobPopupOpen).toHaveBeenCalledWith(false);
  });

  it('navigates to MyJobs page when "View saved posts" is clicked', () => {
    render(<SaveJobPopup />);
    
    // Find and click the "View saved posts" link
    const viewSavedPostsLink = screen.getByText(/View saved posts/i);
    fireEvent.click(viewSavedPostsLink);
    
    // Check if setSavedJobPopupOpen was called with false
    expect(mockSetSavedJobPopupOpen).toHaveBeenCalledWith(false);
    
    // Check if router.push was called with the correct path
    expect(mockRouter.push).toHaveBeenCalledWith('/MyJobs');
  });

  it('auto-closes after a delay', async () => {
    // Set up fake timers to test auto-hide functionality
    jest.useFakeTimers();
    
    render(<SaveJobPopup />);
    
    // Use act to wrap the timer advance
    act(() => {
      // Fast-forward time by the autoHideDuration (2000ms)
      jest.advanceTimersByTime(2000);
    });
    
    // Check if setSavedJobPopupOpen was called with false after the timeout
    await waitFor(() => {
      expect(mockSetSavedJobPopupOpen).toHaveBeenCalledWith(false);
    });
    
    // Restore real timers
    jest.useRealTimers();
  });

  it('displays the correct styling and avatar', () => {
    render(<SaveJobPopup />);
    
    // Check if the Avatar with "N" is rendered
    const avatar = screen.getByText('N');
    expect(avatar).toBeInTheDocument();
    
    // Check if the Alert component has the success severity
    const alertElement = screen.getByRole('alert');
    expect(alertElement).toBeInTheDocument();
  });
});