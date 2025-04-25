import { create } from "zustand";

interface Search {
  job: string;
  location: string;
}

interface SearchStore {
  recentSearches: Search[];
  addSearch: (search: Search) => void;
  clearSearches: () => void;
  setRecentSearches: (searches: Search[]) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  recentSearches: [],
  addSearch: (search) =>
    set((state) => {
      const isDuplicate = state.recentSearches.some((s) => s.job === search.job);
      const updated = isDuplicate ? state.recentSearches : [...state.recentSearches, search];
      if (typeof window !== "undefined") {
        localStorage.setItem("recentJobSearches", JSON.stringify(updated));
      }
      return { recentSearches: updated };
    }),
  clearSearches: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("recentJobSearches");
    }
    set({ recentSearches: [] });
  },
  setRecentSearches: (searches) => set({ recentSearches: searches }),
}));
