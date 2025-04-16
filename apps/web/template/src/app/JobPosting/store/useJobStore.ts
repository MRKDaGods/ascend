import { create } from "zustand";
import { persist } from "zustand/middleware";

interface JobState {
  title: string;
  companyName: string;
  location: string;
  description: string;
  workplaceType: string;
  jobType: string;
  savedJobPopupOpen: boolean;
  postedJobId: string | null;
  postedJob: Record<string, any> | null; // Added postedJob
  setTitle: (title: string) => void;
  setCompanyName: (companyName: string) => void;
  setLocation: (location: string) => void;
  setDescription: (description: string) => void;
  setWorkplaceType: (type: string) => void;
  setJobType: (type: string) => void;
  setSavedJobPopupOpen: (open: boolean) => void;
  setPostedJobId: (id: string) => void;
  setPostedJob: (job: Record<string, any>) => void; // Added setPostedJob
}

export const useJobStore = create<JobState>()(
  persist(
    (set) => ({
      title: "",
      companyName: "",
      location: "",
      description: "",
      workplaceType: "On-site",
      jobType: "Full-time",
      savedJobPopupOpen: false,
      postedJobId: null,
      postedJob: null, // Added postedJob initialization
      setTitle: (title) => set({ title }),
      setCompanyName: (companyName) => set({ companyName }),
      setLocation: (location) => set({ location }),
      setDescription: (description) => set({ description }),
      setWorkplaceType: (type) => set({ workplaceType: type }),
      setJobType: (type) => set({ jobType: type }),
      setSavedJobPopupOpen: (open) => set({ savedJobPopupOpen: open }),
      setPostedJobId: (id) => set({ postedJobId: id }),
      setPostedJob: (job) => set({ postedJob: job }), // Fixed type for job
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
