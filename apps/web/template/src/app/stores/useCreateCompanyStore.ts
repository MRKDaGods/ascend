// stores/useCompanyStore.ts

import { create } from 'zustand';

interface CompanyState {
  name: string;
  url: string;
  website: string;
  industry: string;
  size: string;
  type: string;
  tagline: string;
  location: string;
  description: string;  // Add description here
  profileImage: string | null;
  coverImage: string | null;
  setCompanyInfo: (data: Partial<CompanyState>) => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  name: '',
  url: '',
  website: '',
  industry: '',
  size: '',
  type: '',
  tagline: '',
  location: '',
  description: '',  // Initialize description
  profileImage: null,
  coverImage: null,
  setCompanyInfo: (data) => set((state) => ({ ...state, ...data })),
}));
