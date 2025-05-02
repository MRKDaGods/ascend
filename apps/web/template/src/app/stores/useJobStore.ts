import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import API from '@/api/api';

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
  // Additional properties
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
  deleteJob: (jobId: number) => void; 
  deletePostedJob: (jobId: number) => Promise<boolean>;
  postJob: (job: Job) => void;
  fetchSavedJobs: (page?: number) => Promise<void>;
  fetchPostedJobs: (page?: number) => Promise<void>;
  fetchAppliedJobs: (page?: number) => Promise<void>;
  resetStore: () => void;
}

// Clear any stored values on initialization
if (typeof window !== 'undefined') {
  localStorage.removeItem('saved_jobs');
  sessionStorage.removeItem('job-store');
}

export const useJobStore = create<JobStore>()(
  persist(
    (set) => ({
      jobs: [],
      activeTab: 'Saved',
      savedJobPopupOpen: false,
      
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSavedJobPopupOpen: (isOpen) => set({ savedJobPopupOpen: isOpen }),

      saveJob: (job) =>
        set((state) => {
          const exists = state.jobs.find((j) => j.job_id === job.job_id);
          const updatedJobs = exists ? state.jobs : [...state.jobs, job];
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
          return { jobs: updatedJobs };
        }),

      deleteJob: async (jobId) => {
        try {
          await API.get(`/job/saved/${jobId}`, {
            method: 'DELETE',
          });

          set((state) => {
            const updatedJobs = state.jobs.filter((job) => job.job_id !== jobId);
            return { jobs: updatedJobs };
          });
        } catch (error) {
          console.error('Failed to delete saved job:', error);
        }
      },

      deletePostedJob: async (jobId) => { 
        try {
          const response = await API.get(`job/${jobId}`, {
            method: 'DELETE',
          });

          if (!response.data) {
            console.error(`Failed to delete posted job. Status: ${response.status}`);
            return false;
          }

          set((state) => {
            const updatedJobs = state.jobs.filter((job) => job.job_id !== jobId);
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
          return { jobs: updatedJobs };
        }),

      fetchSavedJobs: async (page: number = 1) => {
        try {
          const response = await API.get('/job/saved', {
            method: 'GET',
          });
          
          if (!response.data) {
            console.error(`Failed to fetch saved jobs. Status: ${response.status}`);
            return;
          }
          
          const result = response.data;
          console.log('API response (saved jobs):', result);
          
          const updatedJobs: Job[] = result.data.map((job: any) => ({
            ...job,
            status: 'Saved' as JobStatus,
            applicationStatus: job.applicationStatus as ApplicationStatus,
            saved_at: new Date(job.saved_at),
          }));
          
          set((state) => {
            // Get existing jobs that are not saved jobs
            const nonSavedJobs = state.jobs.filter(job => job.status !== 'Saved');
            
            // Combine with saved jobs
            const allJobs = [...nonSavedJobs, ...updatedJobs];
            return { jobs: allJobs };
          });
        } catch (error) {
          console.error('Failed to fetch saved jobs:', error);
        }
      },

      fetchPostedJobs: async (page: number = 1) => {
        try {
          // Fetch all companies that belong to the current user
          const companiesResponse = await API.get('/company/companies', {
            method: 'GET',
          });
      
          if (!companiesResponse.data) {
            console.error(`Failed to fetch companies. Status: ${companiesResponse.status}`);
            return;
          }
      
          const companiesResult = companiesResponse.data;
          console.log('User companies:', companiesResult);
      
          if (!companiesResult.data || !companiesResult.data.companies || !Array.isArray(companiesResult.data.companies)) {
            console.error('Unexpected companies API response format:', companiesResult);
            return;
          }
      
          const companyIds = companiesResult.data.companies.map((company: { company_id: number }) => company.company_id);
          console.log('User company IDs:', companyIds);
      
          if (companyIds.length === 0) {
            console.log('User has no companies. No jobs to fetch.');
            set((state) => {
              const nonPostedJobs = state.jobs.filter(job => job.status !== 'Posted');
              return { jobs: nonPostedJobs };
            });
            return;
          }
      
          // Fetch jobs for all companies in parallel
          const jobPromises = companyIds.map((companyId: number) =>
            API.get(`/job/company/${companyId}?page=${page}`, { 
              method: 'GET',
            })
          );
          
          const jobResponses = await Promise.all(
            jobPromises.map((promise: Promise<any>) =>
              promise.catch((error: any) => ({
                error,
                data: null,
                status: error.response?.status,
              }))
            )
          );

          let allPostedJobs: Job[] = [];
      
          for (let i = 0; i < jobResponses.length; i++) {
            const response = jobResponses[i];
            const companyId = companyIds[i];
      
            // Handle empty response data
            if (!response.data || (typeof response.data === 'object' && Object.keys(response.data).length === 0)) {
              console.log(`No jobs data available for company ${companyId}`);
              continue;
            }
      
            // Handle "No jobs found" error
            if (response.error?.response?.data?.error === "No jobs found for this company") {
              console.log(`No jobs found for company ${companyId}`);
              continue;
            }
      
            // Ensure response.data is an array
            const jobsData = Array.isArray(response.data) ? response.data : 
                            Array.isArray(response.data.jobs) ? response.data.jobs : 
                            Array.isArray(response.data.data) ? response.data.data : null;
      
            if (!jobsData) {
              console.log(`Unexpected job API response format for company ${companyId}:`, response.data);
              continue;
            }
      
            const companyPostedJobs: Job[] = jobsData.map((job: any) => ({
              ...job,
              saved_at: new Date(),
              status: 'Posted' as JobStatus,
              created_at: new Date(job.created_at || Date.now()),
              // Ensure all required fields have fallback values
              title: job.title || 'Untitled Position',
              description: job.description || '',
              industry: job.industry || '',
              type: job.type || '',
              experience_level: job.experience_level || '',
              location: job.location || '',
              workplace_type: job.workplace_type || '',
              salary_min_range: job.salary_min_range || null,
              salary_max_range: job.salary_max_range || null,
              company_id: companyId,
              company_name: job.company_name || '',
              company_logo_url: job.company_logo_url || null,
            }));
      
            allPostedJobs = [...allPostedJobs, ...companyPostedJobs];
            console.log(`Successfully processed ${companyPostedJobs.length} jobs for company ${companyId}`);
          }
          
          // Only update state if we have any jobs to add
          if (allPostedJobs.length > 0) {
            set((state) => {
              const nonPostedJobs = state.jobs.filter(job => job.status !== 'Posted');
              const updatedJobs = [...nonPostedJobs, ...allPostedJobs];
              console.log('Final jobs state - total count:', updatedJobs.length);
              console.log('Final jobs state - posted jobs count:', updatedJobs.filter(job => job.status === 'Posted').length);
              return { jobs: updatedJobs };
            });
          } else {
            console.log('No posted jobs found for any company');
          }
      
        } catch (error) {
          console.error('Failed to fetch posted jobs:', error);
        }
      },
      
      fetchAppliedJobs: async (page: number = 1) => {
        try {
          const response = await API.get(`/job/applications?page=${page}`, {
            method: 'GET',
          });
    
          if (!response.data) {
            console.error(`Failed to fetch applied jobs. Status: ${response.status}`);
            return;
          }
    
          const result = response.data;
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
              saved_at: new Date(),
              status: 'Applied' as JobStatus,
              applicationStatus: application.status as ApplicationStatus || 'Pending',
              application_id: application.application_id,
              resume_url: application.resume_url,
              applied_at: new Date(application.created_at),
            };
          });
          
          set((state) => {
            // Get existing jobs that are not applied jobs
            const nonAppliedJobs = state.jobs.filter(job => job.status !== 'Applied');
            
            // Combine with applied jobs
            const allJobs = [...nonAppliedJobs, ...appliedJobs];
            console.log('Updated jobs with applied jobs:', allJobs);
            console.log('Applied jobs count:', appliedJobs.length);
            
            return { jobs: allJobs };
          });
        } catch (error) {
          console.error('Failed to fetch applied jobs:', error);
        }
      },

      resetStore: () => set({ 
        jobs: [],
        activeTab: 'Saved',
        savedJobPopupOpen: false,
      }),
    }),
    {
      name: "job-store",
      storage: {
        getItem: (name) => {
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);