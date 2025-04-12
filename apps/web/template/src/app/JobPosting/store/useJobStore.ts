import { create } from "zustand";
import { persist } from "zustand/middleware";

interface JobState {
  title: string;
  companyName: string;
  location: string;
  description: string;
  workplaceType: string;
  jobType: string;
  setTitle: (title: string) => void;
  setCompanyName: (companyName: string) => void;
  setLocation: (location: string) => void;
  setDescription: (description: string) => void;
  setWorkplaceType: (type: string) => void;
  setJobType: (type: string) => void;
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
      setTitle: (title) => set({ title }),
      setCompanyName: (companyName) => set({ companyName }),
      setLocation: (location) => set({ location }),
      setDescription: (description) => set({ description }),
      setWorkplaceType: (type) => set({ workplaceType: type }),
      setJobType: (type) => set({ jobType: type }),
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
