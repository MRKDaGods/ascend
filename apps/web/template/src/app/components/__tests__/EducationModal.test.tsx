import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EducationModal from '../EducationModal';

const mockOnClose = jest.fn();
const mockOnSave = jest.fn();

describe('EducationModal Component', () => {
  beforeEach(() => {
    // Clear mock functions before each test
    mockOnClose.mockClear();
    mockOnSave.mockClear();
  });

  it('renders when open', () => {
    render(<EducationModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
    expect(screen.getByText('Add Education')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    const { container } = render(<EducationModal isOpen={false} onClose={mockOnClose} onSave={mockOnSave} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles input changes', () => {
    render(<EducationModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
    const schoolInput = screen.getByPlaceholderText('Ex: Cairo University') as HTMLInputElement;
    fireEvent.change(schoolInput, { target: { value: 'Harvard University' } });
    expect(schoolInput.value).toBe('Harvard University');
  });

  it('calls onSave with correct data', () => {
    render(<EducationModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
    const schoolInput = screen.getByPlaceholderText('Ex: Cairo University');
    fireEvent.change(schoolInput, { target: { value: 'Harvard University' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({ school: 'Harvard University' }));
  });

  it('calls onClose when close button is clicked', () => {
    render(<EducationModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});

test('renders EducationModal correctly', () => {
  render(<EducationModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
  expect(screen.getByText('Add Education')).toBeInTheDocument();
});
