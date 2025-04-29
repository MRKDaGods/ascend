import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobTabs from '../MyJobs/components/JobTabs';
import { useJobStore } from '../shared/store/useJobStore';

// Mock the job store
jest.mock('../shared/store/useJobStore', () => ({
  useJobStore: jest.fn(),
}));

describe('JobTabs Component', () => {
  const mockSetActiveTab = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock return value - with type assertion to fix TypeScript error
    (useJobStore as unknown as jest.Mock).mockReturnValue({
      activeTab: 'Saved',
      setActiveTab: mockSetActiveTab,
    });
  });

  it('renders all tabs correctly', () => {
    render(<JobTabs />);
    
    // Check if all tabs are rendered
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Applied')).toBeInTheDocument();
    expect(screen.getByText('Posted')).toBeInTheDocument();
    
    // Check if the tabs container has correct attributes
    const tabsElement = screen.getByRole('tablist');
    expect(tabsElement).toBeInTheDocument();
    expect(tabsElement).toHaveAttribute('aria-label', 'job status tabs');
  });

  it('selects the active tab based on store value', () => {
    // Set up with 'Applied' as the active tab
    (useJobStore as unknown as jest.Mock).mockReturnValue({
      activeTab: 'Applied',
      setActiveTab: mockSetActiveTab,
    });
    
    render(<JobTabs />);
    
    // Check if the Applied tab is selected (has aria-selected="true")
    const appliedTab = screen.getByRole('tab', { name: 'Applied' });
    expect(appliedTab).toHaveAttribute('aria-selected', 'true');
    
    // The other tabs should not be selected
    expect(screen.getByRole('tab', { name: 'Saved' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tab', { name: 'Posted' })).toHaveAttribute('aria-selected', 'false');
  });

  it('selects the Posted tab based on store value', () => {
    // Set up with 'Posted' as the active tab
    (useJobStore as unknown as jest.Mock).mockReturnValue({
      activeTab: 'Posted',
      setActiveTab: mockSetActiveTab,
    });
    
    render(<JobTabs />);
    
    // Check if the Posted tab is selected
    const postedTab = screen.getByRole('tab', { name: 'Posted' });
    expect(postedTab).toHaveAttribute('aria-selected', 'true');
  });

  it('calls setActiveTab when a tab is clicked', () => {
    render(<JobTabs />);
    
    // Initially, 'Saved' is active, click on 'Applied'
    const appliedTab = screen.getByRole('tab', { name: 'Applied' });
    fireEvent.click(appliedTab);
    
    // Check if setActiveTab was called with the correct value
    expect(mockSetActiveTab).toHaveBeenCalledWith('Applied');
    
    // Click on Posted tab
    const postedTab = screen.getByRole('tab', { name: 'Posted' });
    fireEvent.click(postedTab);
    
    // Check if setActiveTab was called again with the correct value
    expect(mockSetActiveTab).toHaveBeenCalledWith('Posted');
  });

  it('applies the correct styling to the tabs container', () => {
    const { container } = render(<JobTabs />);
    
    // Find the top-level Box component
    const boxElement = container.firstChild;
    expect(boxElement).toHaveClass('MuiBox-root');
    
    // Check the tablist element exists with correct attribute
    const tabsElement = screen.getByRole('tablist');
    expect(tabsElement).toHaveAttribute('aria-label', 'job status tabs');
    
    // The actual DOM structure for MUI Tabs is:
    // div.MuiBox-root > div.MuiTabs-root > div.MuiTabs-scroller
    
    // Check if we have a scroller element (which is what we found in the error)
    const scrollerElement = tabsElement.parentElement;
    expect(scrollerElement).toHaveClass('MuiTabs-scroller');
    
    // Find the actual Tabs root element (parent of scroller)
    const tabsRoot = scrollerElement.parentElement;
    expect(tabsRoot).toHaveClass('MuiTabs-root');
  });

  it('renders each tab with correct value and key', () => {
    render(<JobTabs />);
    
    // Get all tabs
    const tabs = screen.getAllByRole('tab');
    
    // Check if we have correct number of tabs
    expect(tabs).toHaveLength(3);
    
    // Check if each tab has the correct text content
    expect(tabs[0]).toHaveTextContent('Saved');
    expect(tabs[1]).toHaveTextContent('Applied');
    expect(tabs[2]).toHaveTextContent('Posted');
  });
});