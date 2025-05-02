import { create } from 'zustand';
import { useMediaStore } from "./useMediaStore";
import {
  createCompanyAnnouncementAPI,
  deleteCompanyAnnouncementAPI,
  updateCompanyAnnouncementAPI,
} from "@/api/company";
import { useCompanyStore } from "./useCreateCompanyStore";

export interface MediaFile {
  type: 'image' | 'video' | 'document';
  file: File;
  preview: string;
  url?: string;
  id?: number; // <- Add ID to track image_ids
}

export interface CompanyPost {
  id: string;
  content: string;
  media: MediaFile[];
  createdAt: Date;
  image?: string;
  video?: string;
  repostSourcePost?: CompanyPost | null;
}

interface CompanyPostStore {
  posts: CompanyPost[];
  draftPost: {
    content: string;
    media: MediaFile[];
  };
  removedImageIds: number[];
  open: boolean;
  postText: string;
  draftText: string;
  editingPost: CompanyPost | null;

  repostSourcePost: CompanyPost | null;
  setRepostSourcePost: (post: CompanyPost | null) => void;

  repostPopupOpen: boolean;
  setRepostPopupOpen: (open: boolean) => void;

  lastCompanyPostId: number | null;
  setLastCompanyPostId: (id: number) => void;

  discardCompanyPostDialogOpen: boolean;
  discardCompanyRepostDialogOpen: boolean;

  closeDiscardCompanyPostDialog: () => void;
  closeDiscardCompanyRepostDialog: () => void;

  openDiscardCompanyPostDialog: () => void;
  openDiscardCompanyRepostDialog: () => void;

  setCompanyDraftSavedPopupOpen: (open: boolean) => void;

  draftSavedPopupOpen: boolean;
  setDraftSavedPopupOpen: (open: boolean) => void;

  setDraftPostContent: (content: string) => void;
  addDraftMedia: (mediaArray: MediaFile[]) => void;
  removeDraftMedia: (index: number) => void;
  clearDraftPost: () => void;
  addPost: () => boolean;
  deletePost: (postId: string) => Promise<void>;
  updatePost: (postId: string) => Promise<boolean>;
  createAnnouncementPost: () => Promise<boolean>;

  setOpen: (open: boolean) => void;
  setPostText: (text: string) => void;
  setDraftText: (text: string) => void;
  resetPost: () => void;
  setEditingPost: (post: CompanyPost) => void;
  setCompanyAnnouncementsToPosts: () => void;
}

export const useCompanyPostStore = create<CompanyPostStore>((set, get) => ({
  posts: [],
  draftPost: {
    content: '',
    media: [],
  },
  removedImageIds: [],
  lastCompanyPostId: null,
  setLastCompanyPostId: (id) => set({ lastCompanyPostId: id }),

  open: false,
  setOpen: (open) => set({ open }),
  postText: "",
  setPostText: (text) => set({ postText: text }),
  draftText: "",
  setDraftText: (text) => set({ draftText: text }),
  editingPost: null,
  discardCompanyPostDialogOpen: false,
  discardCompanyRepostDialogOpen: false,

  draftSavedPopupOpen: false,
  setDraftSavedPopupOpen: (open) => set({ draftSavedPopupOpen: open }),

  openDiscardCompanyPostDialog: () => set({ discardCompanyPostDialogOpen: true }),
  closeDiscardCompanyPostDialog: () => set({ discardCompanyPostDialogOpen: false }),

  openDiscardCompanyRepostDialog: () => set({ discardCompanyRepostDialogOpen: true }),
  closeDiscardCompanyRepostDialog: () => set({ discardCompanyRepostDialogOpen: false }),

  setCompanyDraftSavedPopupOpen: (open) => set({ draftSavedPopupOpen: open }),

  setRepostPopupOpen: (open) => set({ repostPopupOpen: open }),
  repostPopupOpen: false,

  repostSourcePost: null,
  setRepostSourcePost: (post) => set({ repostSourcePost: post }),

  setEditingPost: (post: CompanyPost) => {
    const { setMediaFiles, setMediaPreviews } = useMediaStore.getState();
    const previews = post.media.map((m) => m.preview);
    setMediaFiles([]);
    setMediaPreviews(previews);

    const clonedMedia = post.media.map((m) => ({ ...m }));

    set({
      editingPost: {
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        media: clonedMedia,
        image: post.image,
        video: post.video,
        repostSourcePost: post.repostSourcePost || null,
      },
      draftPost: {
        content: post.content,
        media: clonedMedia,
      },
      removedImageIds: [],
      open: true,
    });
  },

  resetPost: () => set({ open: false, postText: "", editingPost: null }),

  setDraftPostContent: (content) =>
    set((state) => ({
      draftPost: { ...state.draftPost, content },
    })),

  addDraftMedia: (mediaArray) =>
    set((state) => ({
      draftPost: {
        ...state.draftPost,
        media: [...state.draftPost.media, ...mediaArray],
      },
    })),

  removeDraftMedia: (index) =>
    set((state) => {
      const removed = state.draftPost.media[index];
      const updatedMedia = state.draftPost.media.filter((_, i) => i !== index);
      const removedIds = removed.id ? [...state.removedImageIds, removed.id] : state.removedImageIds;
      return {
        draftPost: {
          ...state.draftPost,
          media: updatedMedia,
        },
        removedImageIds: removedIds,
      };
    }),

  clearDraftPost: () =>
    set({
      draftPost: {
        content: '',
        media: [],
      },
      removedImageIds: [],
    }),

  addPost: () => {
    const { draftPost, posts } = get();
    if (!draftPost.content.trim() && draftPost.media.length === 0) return false;

    const newPost: CompanyPost = {
      id: Date.now().toString(),
      content: draftPost.content.trim(),
      media: draftPost.media,
      createdAt: new Date(),
    };

    set({
      posts: [...posts, newPost],
      draftPost: { content: '', media: [] },
      removedImageIds: [],
    });

    return true;
  },

  deletePost: async (postId) => {
    const companyId = useCompanyStore.getState().companyId;
    if (!companyId) return;
    try {
      await deleteCompanyAnnouncementAPI(companyId, Number(postId));
      set((state) => ({
        posts: state.posts.filter((post) => post.id !== postId),
      }));
    } catch (error) {
      console.error("❌ Failed to delete post", error);
    }
  },

  updatePost: async (postId: string) => {
    const companyId = useCompanyStore.getState().companyId;
    const { draftPost, posts, editingPost, removedImageIds } = get();

    if (!companyId || !editingPost) {
      console.error("❌ Missing company ID or editing post.");
      return false;
    }

    try {
      const announcement = await updateCompanyAnnouncementAPI(
        companyId,
        Number(postId),
        draftPost.content.trim(),
        draftPost.media,
        removedImageIds // pass as additional parameter
      );

      const updatedMedia: MediaFile[] = [
        ...announcement.image_urls.map((url: string, i: number) => ({
          type: "image",
          file: {} as File,
          preview: url,
          url,
          id: announcement.image_ids[i],
        })),
        ...(announcement.video_url
          ? [{
              type: "video",
              file: {} as File,
              preview: announcement.video_url,
              url: announcement.video_url,
            }]
          : []),
      ];

      const updatedPost: CompanyPost = {
        id: announcement.announcement_id.toString(),
        content: announcement.content,
        createdAt: new Date(announcement.created_at),
        media: updatedMedia,
      };

      set({
        posts: posts.map((p) => (p.id === postId ? updatedPost : p)),
        draftPost: { content: '', media: [] },
        removedImageIds: [],
      });

      return true;
    } catch (error) {
      console.error("❌ Failed to update post", error);
      return false;
    }
  },

  createAnnouncementPost: async () => {
    const { draftPost, posts } = get();
    const companyId = useCompanyStore.getState().companyId;
    if (!draftPost.content.trim() && draftPost.media.length === 0) return false;
    if (!companyId) return false;
  
    console.log("📤 Creating post with media:", draftPost.media);
  
    try {
      const announcement = await createCompanyAnnouncementAPI(
        companyId,
        draftPost.content.trim(),
        draftPost.media
      );
  
      const newPost: CompanyPost = {
        id: announcement.announcement_id.toString(),
        content: announcement.content,
        createdAt: new Date(announcement.created_at),
        media: [
          ...(announcement.image_urls || []).map((url: string, i: number) => ({
            type: "image",
            file: {} as File,
            preview: url,
            url,
            id: announcement.image_ids[i],
          })),
          ...(announcement.video_url
            ? [{
                type: "video",
                file: {} as File,
                preview: announcement.video_url,
                url: announcement.video_url,
              }]
            : [])
        ]
      };
  
      set({
        posts: [newPost, ...posts],
        draftPost: { content: '', media: [] },
        removedImageIds: [],
      });
  
      return true;
    } catch (error) {
      console.error("❌ Error posting announcement:", error);
      return false;
    }
  },
  
  setCompanyAnnouncementsToPosts: () => {
    const announcements = useCompanyStore.getState().announcements;
    const transformedPosts: CompanyPost[] = announcements.map((a: any) => ({
      id: a.announcement_id.toString(),
      content: a.content,
      createdAt: new Date(a.created_at),
      media: a.image_urls.map((url: string, i: number) => ({
        type: "image",
        file: {} as File,
        preview: url,
        url,
        id: a.image_ids[i],
      })).concat(
        a.video_url
          ? [{
              type: "video",
              file: {} as File,
              preview: a.video_url,
              url: a.video_url,
            }]
          : []
      )
    }));

    set({ posts: transformedPosts });
  }
}));
