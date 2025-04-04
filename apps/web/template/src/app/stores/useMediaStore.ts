import { create } from "zustand";

interface MediaStoreState {
  mediaFiles: File[];
  mediaPreviews: string[];
  editorOpen: boolean;
  discardDialogOpen: boolean;

  setMediaFiles: (files: File[]) => void;
  addMediaFile: (file: File) => void;
  removeMediaFile: (index: number) => void;
  clearAllMedia: () => void;

  openEditor: () => void;
  closeEditor: () => void;

  openDiscardDialog: () => void;
  closeDiscardDialog: () => void;
}

export const useMediaStore = create<MediaStoreState>((set) => ({
  mediaFiles: [],
  mediaPreviews: [],
  editorOpen: false,
  discardDialogOpen: false,

  setMediaFiles: (files) => {
    const previews = files.map((file) => URL.createObjectURL(file));
    set({ mediaFiles: files, mediaPreviews: previews });
  },

  addMediaFile: (file: File) =>
    set((state) => ({
      mediaFiles: [...state.mediaFiles, file],
      mediaPreviews: [...state.mediaPreviews, URL.createObjectURL(file)],
    })),
    
  removeMediaFile: (index) =>
    set((state) => {
      const updatedFiles = [...state.mediaFiles];
      const updatedPreviews = [...state.mediaPreviews];
      updatedFiles.splice(index, 1);
      updatedPreviews.splice(index, 1);
      return {
        mediaFiles: updatedFiles,
        mediaPreviews: updatedPreviews,
      };
    }),

  clearAllMedia: () => set({ mediaFiles: [], mediaPreviews: [] }),

  openEditor: () => set({ editorOpen: true }),
  closeEditor: () => set({ editorOpen: false }),

  openDiscardDialog: () => set({ discardDialogOpen: true }),
  closeDiscardDialog: () => set({ discardDialogOpen: false }),
}));
