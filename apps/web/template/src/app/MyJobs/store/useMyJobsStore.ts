// src/store/useMyJobsStore.ts
import { create } from 'zustand';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  status: 'Saved' | 'In Progress' | 'Applied' | 'Archived';
  logo?: string;
  postedAt?: string;
}

interface MyJobsState {
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
}

export const useMyJobsStore = create<MyJobsState>((set) => ({
  jobs: [],
  setJobs: (jobs) => set({ jobs }),
}));
