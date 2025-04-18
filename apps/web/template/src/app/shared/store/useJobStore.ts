import { create } from 'zustand';

export type JobStatus = 'Saved' | 'In Progress' | 'Applied' | 'Archived';
export type ApplicationStatus = 'Pending' | 'Viewed' | 'Rejected' | 'Accepted'; 
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
  applicationStatus?: ApplicationStatus;
}

interface JobStore {
  jobs: Job[];
  activeTab: JobStatus;
  savedJobPopupOpen: boolean;
  setActiveTab: (tab: JobStatus) => void;
  setSavedJobPopupOpen: (isOpen: boolean) => void;
  saveJob: (job: Job) => void;
  applyJob: (job: Job) => void;
  fetchSavedJobs: () => Promise<void>;
}

export const useJobStore = create<JobStore>((set) => ({
  jobs: [],
  activeTab: 'Saved',
  savedJobPopupOpen: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSavedJobPopupOpen: (isOpen) => set({ savedJobPopupOpen: isOpen }),
  saveJob: (job) =>
    set((state) => {
      const exists = state.jobs.find((j) => j.id === job.id);
      return exists ? state : { jobs: [...state.jobs, job] };
    }),
    applyJob: (job) =>
      set((state) => {
        const exists = state.jobs.find((j) => j.id === job.id);
        if (exists) {
          return {
            jobs: state.jobs.map((j) =>
              j.id === job.id
                ? { ...j, status: 'Applied', applicationStatus: 'Pending' }
                : j
            ),
          };
        } else {
          return {
            jobs: [...state.jobs, { ...job, status: 'Applied', applicationStatus: 'Pending' }],
          };
        }
      }),
    
  fetchSavedJobs: async () => {
    try {
      const response = await fetch('/api/saved-jobs'); //when integrating with backend, we must put the actual endpoint
      const data: Job[] = await response.json();
      set({ jobs: data });
    } catch (error) {
      console.error('Failed to fetch saved jobs:', error);
    }
  },
}));
