// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import SkillsModal from '../SkillsModal';

// beforeEach(() => {
//   global.fetch = jest.fn(() =>
//     Promise.resolve({
//       ok: true,
//       json: () => Promise.resolve([]), // Default mock response
//     })
//   ) as jest.Mock;
// });

// const mockOnClose = jest.fn();
// const mockOnSave = jest.fn();

// describe('SkillsModal Component', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('renders when open', () => {
//     render(<SkillsModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
//     expect(screen.getByText('Add a Skill')).toBeInTheDocument();
//   });

//   it('does not render when closed', () => {
//     const { container } = render(
//       <SkillsModal isOpen={false} onClose={mockOnClose} onSave={mockOnSave} />
//     );
//     expect(container.firstChild).toBeNull();
//   });

//   it('fetches and displays skills when opened', async () => {
//     (global.fetch as jest.Mock).mockResolvedValueOnce({
//       ok: true,
//       json: async () => [{ name: 'React' }, { name: 'JavaScript' }],
//     });

//     render(<SkillsModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

//     // Debug the DOM
//     screen.debug();

//     await waitFor(() => expect(fetch).toHaveBeenCalledWith('http://localhost:3002/skills'));
//     expect(await screen.findByText('React')).toBeInTheDocument();
//     expect(await screen.findByText('JavaScript')).toBeInTheDocument();
//   });

//   it('handles input changes', () => {
//     render(<SkillsModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
//     const input = screen.getByPlaceholderText('Skill (ex: Project Management)');
//     fireEvent.change(input, { target: { value: 'TypeScript' } });
//     expect(input).toHaveValue('TypeScript');
//   });

//   it('calls onSave with correct data', async () => {
//     (global.fetch as jest.Mock).mockResolvedValueOnce({
//       ok: true,
//       json: async () => ({ name: 'TypeScript' }),
//     });
//     render(<SkillsModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
//     const input = screen.getByPlaceholderText('Skill (ex: Project Management)');
//     fireEvent.change(input, { target: { value: 'TypeScript' } });
//     fireEvent.click(screen.getByText('Save'));
//     await waitFor(() => expect(mockOnSave).toHaveBeenCalledWith({ name: 'TypeScript' }));
//   });

//   it('displays an error message on API failure', async () => {
//     (global.fetch as jest.Mock).mockResolvedValueOnce({
//       ok: false,
//     });
//     render(<SkillsModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
//     fireEvent.click(screen.getByText('Save'));
//     await waitFor(() => expect(screen.getByText('Failed to save skill')).toBeInTheDocument());
//   });

//   it('closes the modal when close button is clicked', () => {
//     render(<SkillsModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
//     fireEvent.click(screen.getByText('×'));
//     expect(mockOnClose).toHaveBeenCalled();
//   });
// });
