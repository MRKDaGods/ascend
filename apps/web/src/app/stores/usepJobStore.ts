import { create } from "zustand";
import { persist } from "zustand/middleware";
interface JobState {
  title: string;
  companyName: string;
  companyId: number | null; // Make sure this is a single field for company ID
  location: string;
  description: string;
  workplaceType: string;
  jobType: string;
  industry: string;
  experienceLevel: string;
  salaryMin: string;
  salaryMax: string;
  savedJobPopupOpen: boolean;
  postedJobId: string | null;
  postedJob: Record<string, any> | null;
  setTitle: (title: string) => void;
  setCompanyName: (companyName: string) => void;
  setCompanyId: (companyId: number | null) => void; // Adjust setter to handle only number
  setLocation: (location: string) => void;
  setDescription: (description: string) => void;
  setWorkplaceType: (type: string) => void;
  setJobType: (type: string) => void;
  setIndustry: (industry: string) => void;
  setExperienceLevel: (level: string) => void;
  setSalaryMin: (min: string) => void;
  setSalaryMax: (max: string) => void;
  setSavedJobPopupOpen: (open: boolean) => void;
  setPostedJobId: (id: string) => void;
  setPostedJob: (job: Record<string, any>) => void;
}

export const usepJobStore = create<JobState>()(
  persist(
    (set) => ({
      title: "",
      companyName: "",
      companyId: null, // Default value is null
      location: "",
      description: "",
      workplaceType: "On-site",
      jobType: "Full-time",
      industry: "",
      experienceLevel: "",
      salaryMin: "",
      salaryMax: "",
      savedJobPopupOpen: false,
      postedJobId: null,
      postedJob: null,
      setTitle: (title) => set({ title }),
      setCompanyName: (companyName) => set({ companyName }),
      setCompanyId: (companyId) => set({ companyId }),  
      setLocation: (location) => set({ location }),
      setDescription: (description) => set({ description }),
      setWorkplaceType: (type) => set({ workplaceType: type }),
      setJobType: (type) => set({ jobType: type }),
      setIndustry: (industry) => set({ industry }),
      setExperienceLevel: (level) => set({ experienceLevel: level }),
      setSalaryMin: (min) => set({ salaryMin: min }),
      setSalaryMax: (max) => set({ salaryMax: max }),
      setSavedJobPopupOpen: (open) => set({ savedJobPopupOpen: open }),
      setPostedJobId: (id) => set({ postedJobId: id }),
      setPostedJob: (job) => set({ postedJob: job }),
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
