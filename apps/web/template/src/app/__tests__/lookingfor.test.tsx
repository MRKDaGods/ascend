import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LookingFor from '../components/lookingfor';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img 
      src={props.src} 
      alt={props.alt} 
      width={props.width} 
      height={props.height}
      data-testid="mock-image" 
    />;
  },
}));

describe('LookingFor Component', () => {
  it('renders the component with the correct text', () => {
    render(<LookingFor />);
    
    // Check if the main heading is rendered
    expect(screen.getByText('Are you looking for a new job?')).toBeInTheDocument();
    
    // Check if the description text is rendered
    expect(screen.getByText('Add your preferences to find relevant jobs and get notified about new open roles.')).toBeInTheDocument();
  });

  it('renders both button options', () => {
    render(<LookingFor />);
    
    // Check if both buttons are rendered with the correct text
    expect(screen.getByText('Actively looking')).toBeInTheDocument();
    expect(screen.getByText('Casually browsing')).toBeInTheDocument();
  });

  it('initially renders the image', () => {
    // No need to mock useEffect like this - it's causing React hooks violation
    // We just need to check if the image is rendered
    render(<LookingFor />);
    
    // Check if the image is rendered after client-side rendering
    expect(screen.getByTestId('mock-image')).toBeInTheDocument();
    expect(screen.getByTestId('mock-image')).toHaveAttribute('src', '/jobsPrefrences.svg');
    expect(screen.getByTestId('mock-image')).toHaveAttribute('alt', 'Job Preferences');
  });

  it('hides the component when close button is clicked', () => {
    const { container } = render(<LookingFor />);
    
    // Find and click the close button by looking for the data-testid attribute on CloseIcon
    const closeButton = screen.getByTestId('CloseIcon').closest('button');
    if (closeButton) {
      fireEvent.click(closeButton);
    }
    
    // Check if the component is no longer visible (should return an empty container)
    expect(container.firstChild).toBeNull();
  });

  it('shows the client-side rendered content', () => {
    render(<LookingFor />);
    
    // Check that the component is rendered with all expected elements
    expect(screen.getByText('Are you looking for a new job?')).toBeInTheDocument();
    expect(screen.getByText('Actively looking')).toBeInTheDocument();
    expect(screen.getByText('Casually browsing')).toBeInTheDocument();
    expect(screen.getByTestId('mock-image')).toBeInTheDocument();
  });
});