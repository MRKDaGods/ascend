// ✅ UPDATED: useJobFilterStore.ts
import { create } from 'zustand';

export type JobType = 'Remote' | 'On-site' | 'Hybrid' | '';
export type ExperienceLevel = 'Entry' | 'Mid' | 'Senior' | '';
export type SalaryRange = '' | '0-5000' | '5000-10000' | '10000-20000' | '20000+';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: JobType;
  logo: string;
  reviewTime: string;
  description: string;
  experienceLevel?: ExperienceLevel;
  salaryRange?: SalaryRange;
}

interface JobFilters {
  type: JobType;
  location: string;
  company: string;
  experienceLevel: ExperienceLevel;
  salary: SalaryRange;
}

interface JobFilterStore {
  filters: JobFilters;
  setFilter: <K extends keyof JobFilters>(key: K, value: JobFilters[K]) => void;
  resetFilters: () => void;
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
}

export const useJobFilterStore = create<JobFilterStore>((set) => ({
  filters: {
    type: '',
    location: '',
    company: '',
    experienceLevel: '',
    salary: '',
  },
  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),
  resetFilters: () =>
    set({
      filters: {
        type: '',
        location: '',
        company: '',
        experienceLevel: '',
        salary: '',
      },
    }),
  jobs: [],
  setJobs: (jobs) => set({ jobs }),
}));
