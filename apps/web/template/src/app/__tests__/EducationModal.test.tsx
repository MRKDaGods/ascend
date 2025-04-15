// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import EducationModal from '../EducationModal'; // Adjusted the path to locate the component correctly
// import { Education } from '@ascend/api-client/models';

// interface EducationModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (education: Education) => void;
//   editingEducation?: Education; // Added optional editingEducation prop
// }

// const mockOnClose = jest.fn();
// const mockOnSave = jest.fn();

// const mockEducation: Education = {
//   id: 1,
//   user_id: 1,
//   school: 'University of Cairo',
//   degree: 'Bachelor of Science',
//   field_of_study: 'Engineering',
//   start_date: new Date('2020-01-01'),
//   end_date: new Date('2024-01-01').toISOString(),
//   created_at: new Date(),
//   updated_at: new Date(),
// };

// describe('EducationModal Component', () => {
//   beforeEach(() => {
//     mockOnClose.mockClear();
//     mockOnSave.mockClear();
//   });

//   it('renders the modal when open and displays the correct title', () => {
//     render(<EducationModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
//     expect(screen.getByText('Add Education')).toBeInTheDocument();
//   });

//   it('does not render the modal when closed', () => {
//     const { container } = render(
//       <EducationModal isOpen={false} onClose={mockOnClose} onSave={mockOnSave} />
//     );
//     expect(container.firstChild).toBeNull();
//   });

//   it('displays the editing title when editing existing education', async () => {
//     render(<EducationModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} editingEducation={mockEducation} />);
//     await waitFor(() => expect(screen.getByText('Edit Education')).toBeInTheDocument());
//   });

//   it('fills the form with existing education values when editing', async () => {
//     render(<EducationModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} editingEducation={mockEducation} />);
    
//     expect((screen.getByPlaceholderText('Ex: Cairo University') as HTMLInputElement).value).toBe(mockEducation.school);
//     expect((screen.getByPlaceholderText('Ex: Bachelor\'s in Engineering') as HTMLInputElement).value).toBe(mockEducation.degree);
//     expect((screen.getByPlaceholderText('Ex: Business') as HTMLInputElement).value).toBe(mockEducation.field_of_study);
//     expect(screen.getByDisplayValue('2020-01-01')).toBeInTheDocument();
//     expect(screen.getByDisplayValue('2024-01-01')).toBeInTheDocument();
//   });

//   it('handles input changes correctly', () => {
//     render(<EducationModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
    
//     const schoolInput = screen.getByPlaceholderText('Ex: Cairo University') as HTMLInputElement;
//     fireEvent.change(schoolInput, { target: { value: 'New University' } });
    
//     expect(schoolInput.value).toBe('New University');
//   });

//   it('calls onSave with the correct data when Save is clicked', async () => {
//     render(<EducationModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
    
//     fireEvent.change(screen.getByPlaceholderText('Ex: Cairo University'), { target: { value: 'New School' } });
//     fireEvent.change(screen.getByPlaceholderText('Ex: Bachelor\'s in Engineering'), { target: { value: 'Master\'s in Science' } });
//     fireEvent.change(screen.getByPlaceholderText('Ex: Business'), { target: { value: 'Computer Science' } });
    
//     fireEvent.click(screen.getByText('Save'));

//     await waitFor(() => expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
//       school: 'New School',
//       degree: 'Master\'s in Science',
//       field_of_study: 'Computer Science',
//     })));
//   });

//   it('calls onClose when the Close button is clicked', () => {
//     render(<EducationModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
    
//     fireEvent.click(screen.getByText('Close'));
//     expect(mockOnClose).toHaveBeenCalled();
//   });

//   it('displays existing education entries and allows editing', () => {
//     render(<EducationModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
    
//     // Adding mock education to simulate the list display
//     fireEvent.click(screen.getByText('Edit Education'));

//     expect(screen.getByText(mockEducation.school)).toBeInTheDocument();
//     expect(screen.getByText(mockEducation.degree)).toBeInTheDocument();
//   });
// });
