import { create } from 'zustand';

interface DeletedJobsState {
  deletedJobIds: number[];
  deleteJob: (jobId: number) => void;
  loadDeletedJobs: () => void;
}

export const useDeletedJobsStore = create<DeletedJobsState>((set) => ({
    deletedJobIds: [],
    deleteJob: (jobId) => {
      set((state) => {
        const updated = [...state.deletedJobIds, jobId];
        localStorage.setItem('deletedJobIds', JSON.stringify(updated));
        return { deletedJobIds: updated };
      });
    },
    loadDeletedJobs: () => {
      const stored = localStorage.getItem('deletedJobIds');
      if (stored) {
        set({ deletedJobIds: JSON.parse(stored) });
      }
    },
  }));
