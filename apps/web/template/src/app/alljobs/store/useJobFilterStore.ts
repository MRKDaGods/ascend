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
  keyword: string;
  industry: string;
  salaryRangeMin: string;
  salaryRangeMax: string;
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
  appendJobs: (jobs: Job[]) => void;

  page: number;
  setPage: (page: number) => void;

  hasMore: boolean;
  setHasMore: (hasMore: boolean) => void;
}

export const useJobFilterStore = create<JobFilterStore>((set) => ({
  filters: {
    keyword: '',
    industry: '',
    salaryRangeMin: '',
    salaryRangeMax: '',
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
        keyword: '',
        industry: '',
        salaryRangeMin: '',
        salaryRangeMax: '',
        type: '',
        location: '',
        company: '',
        experienceLevel: '',
        salary: '',
      },
    }),

  jobs: [],
  setJobs: (jobs) => set({ jobs }),
  appendJobs: (newJobs) => set((state) => ({ jobs: [...state.jobs, ...newJobs] })),

  page: 1,
  setPage: (page) => set({ page }),

  hasMore: true,
  setHasMore: (hasMore) => set({ hasMore }),
}));
