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
  isLoading: boolean;
  error: string | null;
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
  clearError: () => void;
}

// Clear any stored values on initialization
if (typeof window !== 'undefined') {
  localStorage.removeItem('saved_jobs');
  sessionStorage.removeItem('job-store');
}

// Helper function to safely extract data from response
const safelyExtractData = (response: any) => {
  if (!response) return null;
  if (!response.data) return null;
  
  // Handle different API response formats
  if (response.data.data) return response.data.data;
  if (Array.isArray(response.data)) return response.data;
  return response.data;
};

// Helper function to sanitize job data
const sanitizeJobData = (job: any): Job => {
  return {
    job_id: job.job_id || 0,
    title: job.title || 'Untitled Position',
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
    saved_at: job.saved_at ? new Date(job.saved_at) : new Date(),
    status: job.status as JobStatus,
    applicationStatus: job.applicationStatus as ApplicationStatus,
    created_at: job.created_at ? new Date(job.created_at || Date.now()) : undefined,
    company_description: job.company_description || '',
    company_industry: job.company_industry || '',
    company_location: job.company_location || '',
    application_id: job.application_id,
    resume_url: job.resume_url,
    applied_at: job.applied_at ? new Date(job.applied_at) : undefined,
  };
};

export const useJobStore = create<JobStore>()(
  persist(
    (set, get) => ({
      jobs: [],
      activeTab: 'Saved',
      savedJobPopupOpen: false,
      isLoading: false,
      error: null,
      
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSavedJobPopupOpen: (isOpen) => set({ savedJobPopupOpen: isOpen }),
      clearError: () => set({ error: null }),

      saveJob: (job) =>
        set((state) => {
          try {
            const exists = state.jobs.find((j) => j.job_id === job.job_id);
            const updatedJobs = exists ? state.jobs : [...state.jobs, sanitizeJobData(job)];
            return { jobs: updatedJobs, error: null };
          } catch (error) {
            console.error('Error saving job:', error);
            return { 
              ...state, 
              error: error instanceof Error ? error.message : 'Failed to save job'
            };
          }
        }),

      applyJob: (job) =>
        set((state) => {
          try {
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
                  ...sanitizeJobData(job),
                  status: 'Applied' as JobStatus,
                  applicationStatus: 'Pending' as ApplicationStatus,
                },
              ];
            }
            return { jobs: updatedJobs, error: null };
          } catch (error) {
            console.error('Error applying for job:', error);
            return { 
              ...state, 
              error: error instanceof Error ? error.message : 'Failed to apply for job'
            };
          }
        }),

      deleteJob: async (jobId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await API.delete(`/job/saved/${jobId}`, {
            method: 'DELETE',
          });

          // Check if response is successful
          if (response && response.status >= 200 && response.status < 300) {
            set((state) => {
              const updatedJobs = state.jobs.filter((job) => job.job_id !== jobId);
              return { jobs: updatedJobs, isLoading: false };
            });
          } else {
            throw new Error(`Failed to delete job. Status: ${response?.status || 'unknown'}`);
          }
        } catch (error) {
          console.error('Failed to delete saved job:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to delete saved job'
          });
        }
      },

      deletePostedJob: async (jobId) => { 
        set({ isLoading: true, error: null });
        try {
          const response = await API.delete(`job/${jobId}`);

          // Check for successful status codes (2xx range)
          if (response.status >= 200 && response.status < 300) {
            set((state) => ({
              jobs: state.jobs.filter((job) => job.job_id !== jobId),
              isLoading: false
            }));
            
            console.log(`Posted job ${jobId} deleted successfully`);
            return true;
          }

          const errorMessage = `Failed to delete posted job. Status: ${response.status}`;
          console.error(errorMessage);
          set({ isLoading: false, error: errorMessage });
          return false;

        } catch (error) {
          let errorMessage = 'Failed to delete posted job';
          
          if (error instanceof Error) {
            errorMessage = error.message;
          } else if (typeof error === 'object' && error !== null && 'response' in error) {
            const apiError = error as any;
            errorMessage = apiError.response?.data?.message || errorMessage;
          }
          
          console.error(errorMessage, error);
          set({ isLoading: false, error: errorMessage });
          return false;
        }
      },

      postJob: (job) =>
        set((state) => {
          try {
            const exists = state.jobs.find((j) => j.job_id === job.job_id);
            const updatedJobs = exists
              ? state.jobs
              : [...state.jobs, { ...sanitizeJobData(job), status: 'Posted' as JobStatus }];
            return { jobs: updatedJobs, error: null };
          } catch (error) {
            console.error('Error posting job:', error);
            return { 
              ...state, 
              error: error instanceof Error ? error.message : 'Failed to post job'
            };
          }
        }),

      fetchSavedJobs: async (page: number = 1) => {
        set({ isLoading: true, error: null });
        try {
          const response = await API.get('/job/saved', {
            method: 'GET',
          });
          
          if (!response || !response.data) {
            throw new Error(`Failed to fetch saved jobs. Status: ${response?.status || 'unknown'}`);
          }
          
          const result = response.data;
          console.log('API response (saved jobs):', result);
          
          // Handle empty data gracefully
          const jobsData = result.data || [];
          
          // If we have an empty array, it's not an error - just no saved jobs
          if (Array.isArray(jobsData) && jobsData.length === 0) {
            console.log('No saved jobs found.');
            set((state) => {
              const nonSavedJobs = state.jobs.filter(job => job.status !== 'Saved');
              return { jobs: nonSavedJobs, isLoading: false };
            });
            return;
          }
          
          const updatedJobs: Job[] = jobsData.map((job: any) => ({
            ...sanitizeJobData(job),
            status: 'Saved' as JobStatus,
            applicationStatus: job.applicationStatus as ApplicationStatus,
            saved_at: new Date(job.saved_at),
          }));
          
          set((state) => {
            // Get existing jobs that are not saved jobs
            const nonSavedJobs = state.jobs.filter(job => job.status !== 'Saved');
            
            // Combine with saved jobs
            const allJobs = [...nonSavedJobs, ...updatedJobs];
            return { jobs: allJobs, isLoading: false };
          });
        } catch (error) {
          let errorMessage = 'Failed to fetch saved jobs';
          
          if (error instanceof Error) {
            errorMessage = error.message;
          } else if (typeof error === 'object' && error !== null && 'response' in error) {
            const apiError = error as any;
            if (apiError.response?.status === 404) {
              // Not an error, just means no saved jobs
              console.log('No saved jobs found (404 response)');
              set((state) => ({ 
                isLoading: false,
                jobs: state.jobs.filter(job => job.status !== 'Saved') 
              }));
              return;
            }
            errorMessage = apiError.response?.data?.message || errorMessage;
          }
          
          console.error(errorMessage);
          set({ isLoading: false, error: errorMessage });
        }
      },

      fetchPostedJobs: async (page: number = 1) => {
        set({ isLoading: true, error: null });
        try {
          // Fetch all companies that belong to the current user
          const companiesResponse = await API.get('/company/companies', {
            method: 'GET',
          });
      
          // Handle invalid response
          if (!companiesResponse || !companiesResponse.data) {
            throw new Error(`Failed to fetch companies. Status: ${companiesResponse?.status || 'unknown'}`);
          }
      
          const companiesResult = companiesResponse.data;
          console.log('User companies:', companiesResult);
      
          // Handle empty or malformed data safely
          const companies = companiesResult?.data?.companies || [];
          
          if (!Array.isArray(companies) || companies.length === 0) {
            console.log('User has no companies. No jobs to fetch.');
            set((state) => {
              const nonPostedJobs = state.jobs.filter(job => job.status !== 'Posted');
              return { jobs: nonPostedJobs, isLoading: false };
            });
            return;
          }
      
          const companyIds = companies.map((company: { company_id: number }) => company.company_id);
          console.log('User company IDs:', companyIds);
      
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
          let errorMessages: string[] = [];
      
          for (let i = 0; i < jobResponses.length; i++) {
            const response = jobResponses[i];
            const companyId = companyIds[i];
            
            // Handle API errors gracefully
            if (response.error) {
              // Don't treat "No jobs found" as an error
              if (response.error?.response?.data?.error === "No jobs found for this company") {
                console.log(`No jobs found for company ${companyId}`);
              } else {
                const message = `Error fetching jobs for company ${companyId}: ${response.error?.message || 'Unknown error'}`;
                console.error(message);
                errorMessages.push(message);
              }
              continue;
            }
      
            // Handle empty response data gracefully
            if (!response.data) {
              console.log(`No jobs data available for company ${companyId}`);
              continue;
            }
      
            // Ensure response.data is an array
            const jobsData = Array.isArray(response.data) ? response.data : 
                            Array.isArray(response.data.jobs) ? response.data.jobs : 
                            Array.isArray(response.data.data) ? response.data.data : [];
      
            if (jobsData.length === 0) {
              console.log(`No jobs found for company ${companyId}`);
              continue;
            }
      
            const companyPostedJobs: Job[] = jobsData.map((job: any) => ({
              ...sanitizeJobData({
                ...job,
                saved_at: new Date(),
                status: 'Posted',
                created_at: job.created_at || Date.now(),
                company_id: companyId,
              })
            }));
      
            allPostedJobs = [...allPostedJobs, ...companyPostedJobs];
            console.log(`Successfully processed ${companyPostedJobs.length} jobs for company ${companyId}`);
          }
          
          // Update state even if no jobs were found - this will clear posted jobs
          set((state) => {
            const nonPostedJobs = state.jobs.filter(job => job.status !== 'Posted');
            const updatedJobs = [...nonPostedJobs, ...allPostedJobs];
            console.log('Final jobs state - total count:', updatedJobs.length);
            console.log('Final jobs state - posted jobs count:', updatedJobs.filter(job => job.status === 'Posted').length);
            
            // Only set error if we have actual errors (not just "no jobs found")
            const errorMessage = errorMessages.length > 0 ? errorMessages.join('; ') : null;
            
            return { 
              jobs: updatedJobs, 
              isLoading: false,
              error: errorMessage
            };
          });
      
        } catch (error) {
          let errorMessage = 'Failed to fetch posted jobs';
          
          if (error instanceof Error) {
            errorMessage = error.message;
          } else if (typeof error === 'object' && error !== null && 'response' in error) {
            const apiError = error as any;
            errorMessage = apiError.response?.data?.message || errorMessage;
          }
          
          console.error(errorMessage);
          set({ isLoading: false, error: errorMessage });
        }
      },
      
      fetchAppliedJobs: async (page: number = 1) => {
        set({ isLoading: true, error: null });
        try {
          const response = await API.get(`/job/applications?page=${page}`, {
            method: 'GET',
          });
    
          if (!response || !response.data) {
            throw new Error(`Failed to fetch applied jobs. Status: ${response?.status || 'unknown'}`);
          }
    
          const result = response.data;
          console.log('API response (applied jobs):', result);
          
          // Handle empty data gracefully
          const applications = Array.isArray(result.data) ? result.data : [];
          
          // Handle empty applications array (no applied jobs)
          if (applications.length === 0) {
            console.log('No applied jobs found.');
            set((state) => {
              const nonAppliedJobs = state.jobs.filter(job => job.status !== 'Applied');
              return { jobs: nonAppliedJobs, isLoading: false };
            });
            return;
          }
          
          const appliedJobs: Job[] = applications.map((application: any) => {
            const job = application.job || {};
            return sanitizeJobData({
              ...job,
              saved_at: new Date(),
              status: 'Applied',
              applicationStatus: application.status || 'Pending',
              application_id: application.application_id,
              resume_url: application.resume_url,
              applied_at: application.created_at,
            });
          });
          
          set((state) => {
            // Get existing jobs that are not applied jobs
            const nonAppliedJobs = state.jobs.filter(job => job.status !== 'Applied');
            
            // Combine with applied jobs
            const allJobs = [...nonAppliedJobs, ...appliedJobs];
            console.log('Updated jobs with applied jobs:', allJobs);
            console.log('Applied jobs count:', appliedJobs.length);
            
            return { jobs: allJobs, isLoading: false };
          });
        } catch (error) {
          let errorMessage = 'Failed to fetch applied jobs';
          
          if (error instanceof Error) {
            errorMessage = error.message;
          } else if (typeof error === 'object' && error !== null && 'response' in error) {
            const apiError = error as any;
            
            // Not an error if it's a 404 (no applications found)
            if (apiError.response?.status === 404) {
              console.log('No applied jobs found (404 response)');
              set((state) => ({ 
                isLoading: false,
                jobs: state.jobs.filter(job => job.status !== 'Applied') 
              }));
              return;
            }
            
            errorMessage = apiError.response?.data?.message || errorMessage;
          }
          
          console.error(errorMessage);
          set({ isLoading: false, error: errorMessage });
        }
      },

      resetStore: () => set({ 
        jobs: [],
        activeTab: 'Saved',
        savedJobPopupOpen: false,
        isLoading: false,
        error: null,
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