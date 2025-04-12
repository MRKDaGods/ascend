import { create } from 'zustand';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  logo: string;
  reviewTime: string;
}

interface SavedJobsState {
  savedJobs: Job[];
  fetchSavedJobs: () => void;
}

export const useSavedJobs = create<SavedJobsState>((set) => ({
  savedJobs: [],
  fetchSavedJobs: async () => {
    try {
      const res = await fetch('http://localhost:5000/saved-jobs', { // ✅ use Mockoon port here
        method: 'POST', // ✅ if your Mockoon API expects POST
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      // If it's not a 200 response, throw
      if (!res.ok) {
        throw new Error(`Unexpected response: ${res.status}`);
      }

      const data = await res.json();

      console.log('✅ Data from API:', data);
      console.log('✅ Is array:', Array.isArray(data));

      if (Array.isArray(data)) {
        set({ savedJobs: data });
      } else {
        console.error('❌ Expected an array but got:', data);
        set({ savedJobs: [] });
      }
    } catch (err) {
      console.error('❌ Error fetching saved jobs:', err);
      set({ savedJobs: [] });
    }
  },
}));
