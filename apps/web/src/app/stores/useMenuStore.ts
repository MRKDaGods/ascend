// stores/useMenuStore.ts
import { create } from "zustand";

interface MenuStore {
  anchorEl: HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;
  closeMenu: () => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  anchorEl: null,
  setAnchorEl: (el) => set({ anchorEl: el }),
  closeMenu: () => set({ anchorEl: null }),
}));
