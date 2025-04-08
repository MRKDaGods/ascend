import { create } from "zustand";

interface UserData {
  id: string;
  name: string;
  role: string;
  location: string;
  profilePhoto: string;
  coverPhoto: string;
  entity: string;
  entityLink: string;
  opentowork: boolean;
}

interface ProfileState {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  userData: null,
  setUserData: (data) => set({ userData: data }),
}));