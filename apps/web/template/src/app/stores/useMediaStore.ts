import { create } from "zustand";

interface MediaStoreState {
  mediaFiles: File[];               // Actual uploaded files
  mediaPreviews: string[];         // Preview URLs (string)
  editorOpen: boolean;             // Media editor popup state
  discardMediaDialogOpen: boolean; // Discard confirmation popup

  // File/Preview control
  setMediaFiles: (files: File[]) => void;
  setMediaPreviews: (previews: string[]) => void;
  addMediaFile: (file: File) => void;
  removeMediaFile: (index: number) => void;
  clearAllMedia: () => void;

  // Editor control
  openEditor: () => void;
  closeEditor: () => void;

  // Discard popup control
  openDiscardMediaDialog: () => void;
  closeDiscardMediaDialog: () => void;
}

export const useMediaStore = create<MediaStoreState>((set) => ({
  mediaFiles: [],
  mediaPreviews: [],
  editorOpen: false,
  discardMediaDialogOpen: false,

  // Set multiple files (e.g. drag/drop or file input)
  setMediaFiles: (files: File[]) => {
    const previews = files.map((file) => URL.createObjectURL(file));
    set({ mediaFiles: files, mediaPreviews: previews });
  },

  // Set preview URLs only (used for editing existing post)
  setMediaPreviews: (previews: string[]) => {
    set({ mediaPreviews: previews });
  },

  // Add one media file and generate preview
  addMediaFile: (file: File) =>
    set((state) => ({
      mediaFiles: [...state.mediaFiles, file],
      mediaPreviews: [...state.mediaPreviews, URL.createObjectURL(file)],
    })),

  // Remove file and its preview
  removeMediaFile: (index: number) =>
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

  // Reset both file and preview state
  clearAllMedia: () => set({ mediaFiles: [], mediaPreviews: [] }),

  // Editor state
  openEditor: () => set({ editorOpen: true }),
  closeEditor: () => set({ editorOpen: false }),

  // Discard dialog state
  openDiscardMediaDialog: () => set({ discardMediaDialogOpen: true }),
  closeDiscardMediaDialog: () => set({ discardMediaDialogOpen: false }),
}));
