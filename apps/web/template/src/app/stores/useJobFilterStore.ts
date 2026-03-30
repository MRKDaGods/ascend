// src/store/useJobFilterStore.ts
import { create } from 'zustand';

type Job = {
  job_id: number;
  title: string;
  description: string;
  industry: string;
  type: string;
  experience_level: string;
  location: string;
  workplace_type: string;
  salary_min_range: number | undefined;
  salary_max_range: number | undefined;
  company_id: number;
  company_name: string;
  company_logo_url: string | null;
  created_at: Date;
};

type JobFilters = {
  keyword: string;
  location: string;
  industry: string;
  experience_level: string[];
  company: string;
  workplace_type: string;
  salary_range_min: number | undefined;
  salary_range_max: number | undefined;
  page: number;
};

type JobFilterStore = JobFilters & {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  setFilter: (key: keyof JobFilters, value: any) => void;
  resetFilters: () => void;
  setJobs: (jobs: Job[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useJobFilterStore = create<JobFilterStore>((set) => ({
  keyword: '',
  location: '',
  industry: '',
  experience_level: [],
  company: '',
  workplace_type: '',
  salary_range_min: undefined,
  salary_range_max: undefined,
  page: 1,
  jobs: [],
  loading: false,
  error: null,
  setFilter: (key, value) => set((state) => ({ ...state, [key]: value })),
  resetFilters: () =>
    set({
      keyword: '',
      location: '',
      industry: '',
      experience_level: [],
      company: '',
      workplace_type: '',
      salary_range_min: undefined,
      salary_range_max: undefined,
      page: 1,
    }),
  setJobs: (jobs) => set({ jobs }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));