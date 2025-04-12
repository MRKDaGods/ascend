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
  logo?: string;
  status: JobStatus;
}

interface JobStore {
  jobs: Job[];
  activeTab: JobStatus;
  savedJobPopupOpen: boolean; // Add this line
  setActiveTab: (tab: JobStatus) => void;
  setSavedJobPopupOpen: (isOpen: boolean) => void; // Add this line
  saveJob: (job: Job) => void;
}

export const useJobStore = create<JobStore>((set) => ({
  jobs: [],
  activeTab: 'Saved',
  savedJobPopupOpen: false, // Initialize the state
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSavedJobPopupOpen: (isOpen) => set({ savedJobPopupOpen: isOpen }), // Define the action
  saveJob: (job) =>
    set((state) => {
      const exists = state.jobs.find((j) => j.id === job.id);
      return exists ? state : { jobs: [...state.jobs, job] };
    }),
}));
