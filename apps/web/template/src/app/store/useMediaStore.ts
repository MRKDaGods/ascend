import { create } from "zustand";

interface MediaStoreState {
  mediaFiles: File[];
  mediaPreviews: string[];
  discardDialogOpen: boolean;
  editorOpen: boolean;
  postEditorOpen: boolean;

  setMediaFiles: (files: File[]) => void;
  removeMediaFile: (index: number) => void;
  clearAllMedia: () => void;

  openDiscardDialog: () => void;
  closeDiscardDialog: () => void;
  openEditor: () => void;
  closeEditor: () => void;
  openPostEditor: () => void;
  closePostEditor: () => void;
}

export const useMediaStore = create<MediaStoreState>((set) => ({
  mediaFiles: [],
  mediaPreviews: [],
  discardDialogOpen: false,
  editorOpen: false,
  postEditorOpen: false,

  setMediaFiles: (files) => {
    const previews = files.map((file) => URL.createObjectURL(file));
    set({ mediaFiles: files, mediaPreviews: previews });
  },

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

  openDiscardDialog: () => set({ discardDialogOpen: true }),
  closeDiscardDialog: () => set({ discardDialogOpen: false }),

  openEditor: () => set({ editorOpen: true }),
  closeEditor: () => set({ editorOpen: false }),

  openPostEditor: () => set({ postEditorOpen: true }),
  closePostEditor: () => set({ postEditorOpen: false }),
}));
