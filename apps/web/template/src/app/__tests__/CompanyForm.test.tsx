import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CompanyForm from '../components/CompanyForm';
import { useCompanyStore } from '@/app/stores/useCreateCompanyStore';

// Mock the Zustand store
jest.mock('@/app/stores/useCreateCompanyStore', () => ({
  useCompanyStore: jest.fn(),
}));

describe('CompanyForm Component', () => {
  const mockSetCompanyInfo = jest.fn();

  beforeEach(() => {
    (useCompanyStore as unknown as jest.Mock).mockReturnValue({
      name: '',
      url: '',
      industry: '',
      location: '',
      description: '',
      domainName: '',
      setCompanyInfo: mockSetCompanyInfo,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form fields correctly', () => {
    render(<CompanyForm />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Domain Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Industry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByText(/Choose Profile Image/i)).toBeInTheDocument();
    expect(screen.getByText(/Choose Cover Image/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/I verify I am an authorized representative./i)).toBeInTheDocument();
  });

  it('updates the store when input fields change', () => {
    render(<CompanyForm />);
    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Company' } });
    expect(mockSetCompanyInfo).toHaveBeenCalledWith({ name: 'Test Company' });
  });

  it('validates the form and enables the submit button when all fields are valid', async () => {
    render(<CompanyForm />);
    const nameInput = screen.getByLabelText(/Name/i);
    const domainInput = screen.getByLabelText(/Domain Name/i);
    const industryInput = screen.getByLabelText(/Industry/i);
    const locationInput = screen.getByLabelText(/Location/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const profileImageInput = screen.getByLabelText(/Choose Profile Image/i).previousSibling as HTMLInputElement;
    const coverImageInput = screen.getByLabelText(/Choose Cover Image/i).previousSibling as HTMLInputElement;
    const checkbox = screen.getByLabelText(/I verify I am an authorized representative./i);
    const submitButton = screen.getByRole('button', { name: /Create Page/i });

    fireEvent.change(nameInput, { target: { value: 'Test Company' } });
    fireEvent.change(domainInput, { target: { value: 'test-domain' } });
    fireEvent.change(industryInput, { target: { value: 'Technology' } });
    fireEvent.change(locationInput, { target: { value: 'New York' } });
    fireEvent.change(descriptionInput, { target: { value: 'A test company description' } });

    const profileFile = new File(['profile'], 'profile.png', { type: 'image/png' });
    const coverFile = new File(['cover'], 'cover.png', { type: 'image/png' });

    fireEvent.change(profileImageInput, { target: { files: [profileFile] } });
    fireEvent.change(coverImageInput, { target: { files: [coverFile] } });
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('disables the submit button when the form is invalid', () => {
    render(<CompanyForm />);
    const submitButton = screen.getByRole('button', { name: /Create Page/i });
    expect(submitButton).toBeDisabled();
  });

  it('calls the handleSubmit function when the form is submitted', async () => {
    render(<CompanyForm />);
    const nameInput = screen.getByLabelText(/Name/i);
    const domainInput = screen.getByLabelText(/Domain Name/i);
    const industryInput = screen.getByLabelText(/Industry/i);
    const locationInput = screen.getByLabelText(/Location/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const profileImageInput = screen.getByLabelText(/Choose Profile Image/i).previousSibling as HTMLInputElement;
    const coverImageInput = screen.getByLabelText(/Choose Cover Image/i).previousSibling as HTMLInputElement;
    const checkbox = screen.getByLabelText(/I verify I am an authorized representative./i);
    const submitButton = screen.getByRole('button', { name: /Create Page/i });

    fireEvent.change(nameInput, { target: { value: 'Test Company' } });
    fireEvent.change(domainInput, { target: { value: 'test-domain' } });
    fireEvent.change(industryInput, { target: { value: 'Technology' } });
    fireEvent.change(locationInput, { target: { value: 'New York' } });
    fireEvent.change(descriptionInput, { target: { value: 'A test company description' } });

    const profileFile = new File(['profile'], 'profile.png', { type: 'image/png' });
    const coverFile = new File(['cover'], 'cover.png', { type: 'image/png' });

    fireEvent.change(profileImageInput, { target: { files: [profileFile] } });
    fireEvent.change(coverImageInput, { target: { files: [coverFile] } });
    fireEvent.click(checkbox);

    await waitFor(() => {
      fireEvent.click(submitButton);
      expect(mockSetCompanyInfo).toHaveBeenCalledTimes(2); // For profileImage and coverImage
    });
  });
});
