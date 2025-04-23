"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ✅ Define ThemeStoreState
interface ThemeStoreState {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

// ✅ Zustand Store with Explicit Typing
export const useThemeStore = create<ThemeStoreState>()(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () =>
        set((state: ThemeStoreState) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
