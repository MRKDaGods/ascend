// File: useUserStore.ts
import { create } from "zustand";

interface Connection {
  id: number;
  name: string;
  headline: string;
  avatar: string;
  isOnline: boolean;
}

interface UserStoreState {
  currentUser: {
    id: number;
    name: string;
    email: string;
    avatar: string;
  };
  connections: Connection[];

  sendDialogOpen: boolean;
  setSendDialogOpen: (open: boolean) => void;

  setConnections: (connections: Connection[]) => void;
  setCurrentUser: (user: UserStoreState["currentUser"]) => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  currentUser: {
    id: 1,
    name: "Default User",
    email: "user@example.com",
    avatar: "/default-avatar.png",
  },
  connections: [],
  sendDialogOpen: false,
  setSendDialogOpen: (open) => set({ sendDialogOpen: open }),

  setConnections: (connections) => set({ connections }),
  setCurrentUser: (user) => set({ currentUser: user }),
}));
