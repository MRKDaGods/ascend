import { render, screen, fireEvent, waitFor } from  '@testing-library/react';
import SkillsModal from '../components/SkillsModal';
import '@testing-library/jest-dom';
import { vi, expect, test, describe, beforeEach } from 'vitest';

// Mocking the fetch function globally
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => [{ id: 1, name: 'JavaScript' }],
}) as unknown as typeof fetch;

describe('SkillsModal Component', () => {
  const mockOnSave = vi.fn().mockResolvedValue(undefined);
  const mockOnClose = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    mockOnSave.mockClear();
    mockOnClose.mockClear();
    (global.fetch as ReturnType<typeof vi.fn>).mockClear();
    global.alert = vi.fn();
  });

  test('renders the modal when isOpen is true', () => {
    render(<SkillsModal isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    expect(screen.getByText(/Manage Skills/i)).toBeInTheDocument();
  });

  test('does not render the modal when isOpen is false', () => {
    render(<SkillsModal isOpen={false} onSave={mockOnSave} onClose={mockOnClose} />);
    expect(screen.queryByText(/Manage Skills/i)).not.toBeInTheDocument();
  });

  test('fetches skills when modal is opened', async () => {
    render(<SkillsModal isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    await waitFor(() => expect(screen.getByDisplayValue('JavaScript')).toBeInTheDocument());
  });

  test('shows error when fetch fails', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Failed to fetch skills'));
    render(<SkillsModal isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    await waitFor(() => expect(screen.getByText(/Failed to fetch skills/i)).toBeInTheDocument());
  });

  test('adds a new skill', async () => {
    render(<SkillsModal isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText(/Add Skill/i));
    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('Skill name').length).toBeGreaterThan(0);
    });
  });

  test('removes a skill', async () => {
    render(<SkillsModal isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText(/Add Skill/i));
    await waitFor(() => {
      const input = screen.getAllByPlaceholderText('Skill name')[0];
      fireEvent.change(input, { target: { value: 'React' } });
    });
    const removeButton = screen.getByText(/Remove/i);
    fireEvent.click(removeButton);
    await waitFor(() => {
      expect(screen.queryByDisplayValue('React')).not.toBeInTheDocument();
    });
  });

  test('alerts when saving if any skill name is empty', async () => {
    render(<SkillsModal isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText(/Add Skill/i));
    fireEvent.click(screen.getByText(/Save All/i));
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('All skills must have a name.');
    });
  });

  test('calls onSave when saving skills', async () => {
    // override fetch to return empty
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });
    render(<SkillsModal isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText(/Add Skill/i));
    const input = screen.getByPlaceholderText('Skill name');
    fireEvent.change(input, { target: { value: 'JavaScript' } });
    fireEvent.click(screen.getByText(/Save All/i));
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith([
        { name: 'JavaScript', id: expect.any(Number) },
      ]);
    });
  });

  test('closes the modal when the close button is clicked', () => {
    render(<SkillsModal isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText('×'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
