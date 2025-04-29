import { create } from 'zustand';

export type JobStatus = 'Saved' | 'Applied' | 'Posted';
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
  // Add these missing properties
  created_at?: Date;
  company_description?: string;
  company_industry?: string;
  company_location?: string;
  // For applications
  application_id?: number;
  resume_url?: string;
  applied_at?: Date;
}

interface JobStore {
  jobs: Job[];
  activeTab: JobStatus;
  savedJobPopupOpen: boolean;
  setActiveTab: (tab: JobStatus) => void;
  setSavedJobPopupOpen: (isOpen: boolean) => void;
  saveJob: (job: Job) => void;
  applyJob: (job: Job) => void;
  deleteJob: (jobId: number) => void; // For saved jobs
  deletePostedJob: (jobId: number) => Promise<boolean>; // New function for posted jobs
  postJob: (job: Job) => void;
  fetchSavedJobs: () => Promise<void>;
  fetchPostedJobs: (page?: number) => Promise<void>;
  fetchAppliedJobs: (page?: number) => Promise<void>;
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
      await fetch(`https://api.ascendx.tech/job/saved/${jobId}`, {
        method: 'DELETE',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTc0NTkzNjc1OSwiZXhwIjoxNzQ1OTc5OTU5fQ.WIm_tsdNxFna8iSU82Q6Q0wykRHN8W93rwwuixbtbZ8',
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

  deletePostedJob: async (jobId) => {
    try {
      // Using the endpoint specified: /:jobId (DELETE)
      const response = await fetch(`https://api.ascendx.tech/job/${jobId}`, {
        method: 'DELETE',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTc0NTkzNjc1OSwiZXhwIjoxNzQ1OTc5OTU5fQ.WIm_tsdNxFna8iSU82Q6Q0wykRHN8W93rwwuixbtbZ8',
        },
      });

      if (!response.ok) {
        console.error(`Failed to delete posted job. Status: ${response.status}`);
        return false;
      }

      // If API call was successful, update the local state
      set((state) => {
        const updatedJobs = state.jobs.filter((job) => job.job_id !== jobId);
        persistJobs(updatedJobs);
        return { jobs: updatedJobs };
      });
      
      console.log(`Posted job ${jobId} deleted successfully`);
      return true;
    } catch (error) {
      console.error('Failed to delete posted job:', error);
      return false;
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

  fetchSavedJobs: async (page : number = 1) => {
    try {
      const response =  
      await fetch(`https://api.ascendx.tech/job/saved/?page=${page}`, {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTc0NTkzNjc1OSwiZXhwIjoxNzQ1OTc5OTU5fQ.WIm_tsdNxFna8iSU82Q6Q0wykRHN8W93rwwuixbtbZ8',
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch saved jobs. Status: ${response.status}`);
        return;
      }

      const result = await response.json();
      console.log('API response (saved jobs):', result);
      const updatedJobs: Job[] = result.data.map((job: any) => ({
        ...job,
        status: 'Saved' as JobStatus,
        applicationStatus: job.applicationStatus as ApplicationStatus,
        saved_at: new Date(job.saved_at),
      }));
      
      // Get existing jobs that are not saved jobs
      const nonSavedJobs = getPersistedJobs().filter(job => job.status !== 'Saved');
      
      // Combine with saved jobs
      const allJobs = [...nonSavedJobs, ...updatedJobs];
      persistJobs(allJobs);
      set({ jobs: allJobs });
    } catch (error) {
      console.error('Failed to fetch saved jobs:', error);
    }
  },

  fetchPostedJobs: async (page: number = 1) => {
    try {
      // First, fetch all companies that belong to the current user
      const companiesResponse = await fetch('https://api.ascendx.tech/company/companies', {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTc0NTkzNjc1OSwiZXhwIjoxNzQ1OTc5OTU5fQ.WIm_tsdNxFna8iSU82Q6Q0wykRHN8W93rwwuixbtbZ8',
        },
      });
      
      if (!companiesResponse.ok) {
        console.error(`Failed to fetch companies. Status: ${companiesResponse.status}`);
        return;
      }
      
      const companiesResult = await companiesResponse.json();
      console.log('User companies:', companiesResult);
      
      if (!companiesResult.data || !companiesResult.data.companies || !Array.isArray(companiesResult.data.companies)) {
        console.error('Unexpected companies API response format:', companiesResult);
        return;
      }
      
      // Extract company IDs
      const companyIds = companiesResult.data.companies.map(company => company.company_id);
      console.log('User company IDs:', companyIds);
      
      if (companyIds.length === 0) {
        console.log('User has no companies. No jobs to fetch.');
        set((state) => {
          const nonPostedJobs = state.jobs.filter(job => job.status !== 'Posted');
          persistJobs(nonPostedJobs);
          return { jobs: nonPostedJobs };
        });
        return;
      }
      
      // Fetch jobs for all companies in parallel
      const jobPromises = companyIds.map(companyId => 
        fetch(`https://api.ascendx.tech/job/company/${companyId}?page=${page}`, {
          method: 'GET',
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTc0NTkzNjc1OSwiZXhwIjoxNzQ1OTc5OTU5fQ.WIm_tsdNxFna8iSU82Q6Q0wykRHN8W93rwwuixbtbZ8',
          },
        })
      );
      
      const jobResponses = await Promise.all(jobPromises);
      
      // Process all responses
      let allPostedJobs: Job[] = [];
      
      for (let i = 0; i < jobResponses.length; i++) {
        const response = jobResponses[i];
        const companyId = companyIds[i];
        
        if (!response.ok) {
          console.error(`Failed to fetch jobs for company ${companyId}. Status: ${response.status}`);
          continue;
        }
        
        const result = await response.json();
        console.log(`Posted jobs for company ${companyId}:`, result);
        
        if (!result.data || !Array.isArray(result.data)) {
          console.error(`Unexpected job API response format for company ${companyId}:`, result);
          continue;
        }
        
        const companyPostedJobs: Job[] = result.data.map((job: any) => ({
          ...job,
          saved_at: new Date(), // This is required by the Job interface
          status: 'Posted' as JobStatus,
          created_at: new Date(job.created_at),
        }));
        
        allPostedJobs = [...allPostedJobs, ...companyPostedJobs];
      }
      
      console.log('Total posted jobs fetched:', allPostedJobs.length);
      
      // Update state with all posted jobs
      set((state) => {
        // First, remove any existing jobs with 'Posted' status
        const nonPostedJobs = state.jobs.filter(job => job.status !== 'Posted');
        
        // Then add our new posted jobs
        const updatedJobs = [...nonPostedJobs, ...allPostedJobs];
        console.log('Final jobs state - total count:', updatedJobs.length);
        console.log('Final jobs state - posted jobs count:', updatedJobs.filter(job => job.status === 'Posted').length);
        
        // Persist to localStorage and update state
        persistJobs(updatedJobs);
        return { jobs: updatedJobs };
      });
    } catch (error) {
      console.error('Failed to fetch posted jobs:', error);
    }
  },
  
  // New function to fetch applied jobs
  fetchAppliedJobs: async (page: number = 1) => {
    try {
      const response = await fetch(`https://api.ascendx.tech/job/applications?page=${page}`, {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTc0NTkzNjc1OSwiZXhwIjoxNzQ1OTc5OTU5fQ.WIm_tsdNxFna8iSU82Q6Q0wykRHN8W93rwwuixbtbZ8',
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch applied jobs. Status: ${response.status}`);
        return;
      }

      const result = await response.json();
      console.log('API response (applied jobs):', result);
      
      if (!result.data || !Array.isArray(result.data)) {
        console.error('Unexpected API response format for applied jobs:', result);
        return;
      }
      
      const appliedJobs: Job[] = result.data.map((application: any) => {
        const job = application.job || {};
        return {
          job_id: job.job_id,
          title: job.title || 'Unknown Job',
          description: job.description || '',
          industry: job.industry || '',
          type: job.type || '',
          experience_level: job.experience_level || '',
          location: job.location || '',
          workplace_type: job.workplace_type || '',
          salary_min_range: job.salary_min_range || null,
          salary_max_range: job.salary_max_range || null,
          company_id: job.company_id || 0,
          company_name: job.company_name || 'Unknown Company',
          company_logo_url: job.company_logo_url || null,
          saved_at: new Date(), // Required field
          status: 'Applied' as JobStatus,
          applicationStatus: application.status as ApplicationStatus || 'Pending',
          application_id: application.application_id,
          resume_url: application.resume_url,
          applied_at: new Date(application.created_at),
        };
      });
      
      // Get existing jobs that are not applied jobs
      const nonAppliedJobs = getPersistedJobs().filter(job => job.status !== 'Applied');
      
      // Combine with applied jobs
      const allJobs = [...nonAppliedJobs, ...appliedJobs];
      console.log('Updated jobs with applied jobs:', allJobs);
      console.log('Applied jobs count:', appliedJobs.length);
      
      persistJobs(allJobs);
      set({ jobs: allJobs });
    } catch (error) {
      console.error('Failed to fetch applied jobs:', error);
    }
  },
}));
