import { create } from 'zustand';

interface JobType {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  status: 'Saved' | 'In Progress' | 'Applied' | 'Archived';
  logo?: string;
  postedAt?: string;
}

interface JobStore {
  activeTab: 'Saved' | 'In Progress' | 'Applied' | 'Archived';
  setActiveTab: (tab: JobStore['activeTab']) => void;
  jobs: JobType[];
  setJobs: (jobs: JobType[]) => void;
}

export const useJobStore = create<JobStore>((set) => ({
  activeTab: 'Saved',
  setActiveTab: (tab) => set({ activeTab: tab }),
  jobs: [],
  setJobs: (jobs) => set({ jobs }),
}));
