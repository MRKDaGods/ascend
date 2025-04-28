import { Profile } from "@ascend/api-client/models";
import { create } from "zustand";

interface ProfileState {
  userData: Profile | null;
  setUserData: (data: Profile) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  userData: null,
  setUserData: (data) => set({ userData: data }),
}));