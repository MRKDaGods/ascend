import { create } from "zustand";

interface MediaStoreState {
  mediaFiles: File[];               // Actual uploaded files
  mediaPreviews: string[];           // Preview URLs for images/videos
  editorOpen: boolean;               // Media editor popup state
  discardMediaDialogOpen: boolean;   // Discard confirmation popup
  mediaType: "image" | "video" | null;

  documentPreview: { url: string; title: string } | null; // PDF preview
  documentFile?: File;               // Real file object for PDF

  // File management
  setMediaFiles: (files: File[]) => void;
  setMediaPreviews: (previews: string[]) => void;
  addMediaFile: (file: File) => void;
  removeMediaFile: (index: number) => void;
  clearAllMedia: () => void;

  // Editor control
  openEditor: (type: "image" | "video") => void;
  closeEditor: () => void;

  // Discard popup control
  openDiscardMediaDialog: () => void;
  closeDiscardMediaDialog: () => void;

  // Document control
  setDocumentPreview: (file: File, title: string) => void;
  clearDocumentPreview: () => void;
}

export const useMediaStore = create<MediaStoreState>((set) => ({
  mediaFiles: [],
  mediaPreviews: [],
  editorOpen: false,
  discardMediaDialogOpen: false,
  mediaType: null,

  documentPreview: null,
  documentFile: undefined,

  // === File Operations ===
  setMediaFiles: (files: File[]) => {
    const previews = files.map((file) => URL.createObjectURL(file));
    set({ mediaFiles: files, mediaPreviews: previews });
  },

  setMediaPreviews: (previews: string[]) => {
    set({ mediaPreviews: previews });
  },

  addMediaFile: (file: File) => set((state) => ({
    mediaFiles: [...state.mediaFiles, file],
    mediaPreviews: [...state.mediaPreviews, URL.createObjectURL(file)],
  })),

  removeMediaFile: (index: number) => set((state) => {
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

  // === Editor Dialog Control ===
  openEditor: (type: "image" | "video") => {
    set({ mediaType: type, editorOpen: true });
  },

  closeEditor: () => {
    set({ editorOpen: false });
  },

  // === Discard Media Popup Control ===
  openDiscardMediaDialog: () => set({ discardMediaDialogOpen: true }),
  closeDiscardMediaDialog: () => set({ discardMediaDialogOpen: false }),

  // === Document (PDF) Operations ===
  setDocumentPreview: (file: File, title: string) => {
    const url = URL.createObjectURL(file);
    set({ documentPreview: { url, title }, documentFile: file }); // ✅ set file too
  },
  clearDocumentPreview: () => set({ documentPreview: null, documentFile: undefined }), // ✅ clear both
  }));
