import { create } from "zustand";

interface MediaStoreState {
  mediaFiles: File[];               // Actual uploaded files
  mediaPreviews: string[];         // Preview URLs (string)
  editorOpen: boolean;             // Media editor popup state
  discardMediaDialogOpen: boolean; // Discard confirmation popup

  // Document-specific preview
  documentPreview: { url: string; title: string } | null;

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

  // Document preview control
  setDocumentPreview: (file: File, title: string) => void;
  clearDocumentPreview: () => void;
}

export const useMediaStore = create<MediaStoreState>((set) => ({
  mediaFiles: [],
  mediaPreviews: [],
  editorOpen: false,
  discardMediaDialogOpen: false,
  documentPreview: null,

  // Set multiple media files
  setMediaFiles: (files: File[]) => {
    const previews = files.map((file) => URL.createObjectURL(file));
    set({ mediaFiles: files, mediaPreviews: previews });
  },

  // Set only preview URLs (e.g. during post edit)
  setMediaPreviews: (previews: string[]) => {
    set({ mediaPreviews: previews });
  },

  // Add one media file
  addMediaFile: (file: File) =>
    set((state) => ({
      mediaFiles: [...state.mediaFiles, file],
      mediaPreviews: [...state.mediaPreviews, URL.createObjectURL(file)],
    })),

  // Remove file and its preview by index
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

  // Clear everything media-related
  clearAllMedia: () => set({ mediaFiles: [], mediaPreviews: [] }),

  // Editor dialog state
  openEditor: () => set({ editorOpen: true }),
  closeEditor: () => set({ editorOpen: false }),

  // Discard media popup state
  openDiscardMediaDialog: () => set({ discardMediaDialogOpen: true }),
  closeDiscardMediaDialog: () => set({ discardMediaDialogOpen: false }),

  // Document preview logic
  setDocumentPreview: (file: File, title: string) => {
    const url = URL.createObjectURL(file);
    set({ documentPreview: { url, title } });
  },
  clearDocumentPreview: () => set({ documentPreview: null }),
}));
