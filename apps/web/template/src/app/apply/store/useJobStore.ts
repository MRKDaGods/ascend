import { create } from 'zustand';

export type JobStatus = 'Saved' | 'In Progress' | 'Applied' | 'Archived';

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  about: string;
  requirements: string[];
  status: JobStatus;
}

interface JobStore {
  savedJobPopupOpen: boolean;
  setSavedJobPopupOpen: (value: boolean) => void;
  savedJobs: Job[];
  saveJob: (job: Job) => void;
  activeTab: JobStatus;
  setActiveTab: (tab: JobStatus) => void;
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
}

export const useJobStore = create<JobStore>((set) => ({
  savedJobPopupOpen: false,
  setSavedJobPopupOpen: (value) => set({ savedJobPopupOpen: value }),
  savedJobs: [],
  saveJob: (job) =>
    set((state) => {
      const exists = state.savedJobs.find((j) => j.id === job.id);
      return exists
        ? state
        : { savedJobs: [...state.savedJobs, job], jobs: [...state.jobs, job] };
    }),
  activeTab: 'Saved',
  setActiveTab: (tab) => set({ activeTab: tab }),
  jobs: [],
  setJobs: (jobs) => set({ jobs }),
}));
