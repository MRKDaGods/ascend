import { create } from 'zustand';

export type JobStatus = 'Saved' | 'In Progress' | 'Applied' | 'Archived' | 'Posted';
export type ApplicationStatus = 'Pending' | 'Viewed' | 'Rejected' | 'Accepted';

export interface Job {
  job_id: number;
  title: string;
  description: string;
  industry: string;
  type: string;
  experience_level: string;
  location: string;
  workplace_type: string;
  salary_min_range: number | null;
  salary_max_range: number | null;
  company_id: number;
  company_name: string;
  company_logo_url: string | null;
  saved_at: Date;
}

interface JobStore {
  jobs: Job[];
  activeTab: JobStatus;
  savedJobPopupOpen: boolean;
  setActiveTab: (tab: JobStatus) => void;
  setSavedJobPopupOpen: (isOpen: boolean) => void;
  saveJob: (job: Job) => void;
  applyJob: (job: Job) => void;
  postJob: (job: Job) => void; 
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
      const exists = state.jobs.find((j) => j.job_id === job.job_id);
      return exists ? state : { jobs: [...state.jobs, job] };
    }),
  applyJob: (job) =>
    set((state) => {
      const exists = state.jobs.find((j) => j.job_id === job.job_id);
      if (exists) {
        return {
          jobs: state.jobs.map((j) =>
            j.job_id === job.job_id
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
  postJob: (job) => // ✅ Added this function
    set((state) => {
      const exists = state.jobs.find((j) => j.job_id === job.job_id);
      return exists
        ? state
        : { jobs: [...state.jobs, { ...job, status: 'Posted' }] };
    }),
  fetchSavedJobs: async () => {
    try {
      const response = await fetch('https://api.ascendx.tech/job/save', { method: 'GET' , headers:{ 'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzQ1MDk2OTE0LCJleHAiOjE3NDUxNDAxMTR9.IvFSGGw8xI7MdUCCA-yxIo0ztnKiw0Opbz5ItHFkHTg` }});
      const result = await response.json();
    const updatedJobs = result.data.map((job: Job) => ({ ...job, status: 'Saved' }));
    set({ jobs: updatedJobs });
    } catch (error) {
      console.error('Failed to fetch saved jobs:', error);
    }
  },
}));
