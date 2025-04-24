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
  status?: JobStatus;
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
  deleteJob: (jobId: number) => void;
  postJob: (job: Job) => void;
  fetchSavedJobs: () => Promise<void>;
}

const getPersistedJobs = (): Job[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('saved_jobs');
  return stored ? JSON.parse(stored) : [];
};

const persistJobs = (jobs: Job[]) => {
  localStorage.setItem('saved_jobs', JSON.stringify(jobs));
};

export const useJobStore = create<JobStore>((set) => ({
  jobs: getPersistedJobs(),
  activeTab: 'Saved',
  savedJobPopupOpen: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSavedJobPopupOpen: (isOpen) => set({ savedJobPopupOpen: isOpen }),

  saveJob: (job) =>
    set((state) => {
      const exists = state.jobs.find((j) => j.job_id === job.job_id);
      const updatedJobs = exists ? state.jobs : [...state.jobs, job];
      persistJobs(updatedJobs);
      return { jobs: updatedJobs };
    }),

  applyJob: (job) =>
    set((state) => {
      const exists = state.jobs.find((j) => j.job_id === job.job_id);
      let updatedJobs;
      if (exists) {
        updatedJobs = state.jobs.map((j) =>
          j.job_id === job.job_id
            ? {
                ...j,
                status: 'Applied' as JobStatus,
                applicationStatus: 'Pending' as ApplicationStatus,
              }
            : j
        );
      } else {
        updatedJobs = [
          ...state.jobs,
          {
            ...job,
            status: 'Applied' as JobStatus,
            applicationStatus: 'Pending' as ApplicationStatus,
          },
        ];
      }
      persistJobs(updatedJobs);
      return { jobs: updatedJobs };
    }),

  deleteJob: async (jobId) => {
    try {
      await fetch(`https://api.ascendx.tech/job/save/${jobId}`, {
        method: 'DELETE',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzQ1NDkwMjA3LCJleHAiOjE3NDU1MzM0MDd9.b3TOGriu8t9-KGaWRVBfXTLmTGL76YsSFff8_CirRx8',
        },
      });

      set((state) => {
        const updatedJobs = state.jobs.filter((job) => job.job_id !== jobId);
        persistJobs(updatedJobs);
        return { jobs: updatedJobs };
      });
    } catch (error) {
      console.error('Failed to delete saved job:', error);
    }
  },

  postJob: (job) =>
    set((state) => {
      const exists = state.jobs.find((j) => j.job_id === job.job_id);
      const updatedJobs = exists
        ? state.jobs
        : [...state.jobs, { ...job, status: 'Posted' as JobStatus }];
      persistJobs(updatedJobs);
      return { jobs: updatedJobs };
    }),

  fetchSavedJobs: async () => {
    try {
      const response = await fetch('https://api.ascendx.tech/job/save', {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzQ1NDkwMjA3LCJleHAiOjE3NDU1MzM0MDd9.b3TOGriu8t9-KGaWRVBfXTLmTGL76YsSFff8_CirRx8',
        },
      });
      const result = await response.json();
      const updatedJobs: Job[] = result.data.map((job: any) => ({
        ...job,
        status: 'Saved' as JobStatus,
        applicationStatus: job.applicationStatus as ApplicationStatus,
        saved_at: new Date(job.saved_at),
      }));
      persistJobs(updatedJobs);
      set({ jobs: updatedJobs });
    } catch (error) {
      console.error('Failed to fetch saved jobs:', error);
    }
  },
}));
