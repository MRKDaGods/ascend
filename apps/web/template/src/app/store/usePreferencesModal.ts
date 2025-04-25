// store/usePreferencesModal.ts
import { create } from 'zustand';
import MainPreferencesPage from '../components/PreferencesViews/MainPreferencesPage';
type PreferencesView = 'main' | 'openToWork' | 'jobAlerts' | 'resume' | 'aiResume' | 'verifications';

interface PreferencesModalState {
  isOpen: boolean;
  currentView: PreferencesView;
  openModal: (view?: PreferencesView) => void;
  closeModal: () => void;
  setView: (view: PreferencesView) => void;
}

export const usePreferencesModal = create<PreferencesModalState>((set) => ({
  isOpen: false,
  currentView: 'main',
  openModal: (view = 'main') => set({ isOpen: true, currentView: view }),
  closeModal: () => set({ isOpen: false, currentView: 'main' }),
  setView: (view) => set({ currentView: view }),
}));
