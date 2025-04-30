import { create } from 'zustand';
import { useMediaStore } from "./useMediaStore";
import { createCompanyAnnouncementAPI } from "@/api/company";
import { useCompanyStore } from "./useCreateCompanyStore";

export interface MediaFile {
  type: 'image' | 'video' | 'document';
  file: File;
  preview: string;
  url?: string;     // 👈 actual backend URL
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
  deletePost: (postId: string) => void;
  createAnnouncementPost: () => Promise<boolean>;

  setOpen: (open: boolean) => void;
  setPostText: (text: string) => void;
  setDraftText: (text: string) => void;
  resetPost: () => void;
  setEditingPost: (post: CompanyPost | null) => void;
  setCompanyAnnouncementsToPosts: () => void;

}

export const useCompanyPostStore = create<CompanyPostStore>((set, get) => ({
  posts: [],
  draftPost: {
    content: '',
    media: [],
  },
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

  setEditingPost: (post) => {
    const { setMediaFiles, setMediaPreviews } = useMediaStore.getState();
    const previews: string[] = [];
    if (post?.image) previews.push(post.image);
    if (post?.video) previews.push(post.video);
    setMediaFiles([]);
    setMediaPreviews(previews);
    set({ editingPost: post, postText: post?.content ?? "", open: true });
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
    set((state) => ({
      draftPost: {
        ...state.draftPost,
        media: state.draftPost.media.filter((_, i) => i !== index),
      },
    })),
  clearDraftPost: () =>
    set({
      draftPost: {
        content: '',
        media: [],
      },
    }),
  addPost: () => {
    const { draftPost, posts } = get();
    if (!draftPost.content.trim() && draftPost.media.length === 0) {
      return false;
    }

    const newPost: CompanyPost = {
      id: Date.now().toString(),
      content: draftPost.content.trim(),
      media: draftPost.media,
      createdAt: new Date(),
    };

    set({
      posts: [...posts, newPost],
      draftPost: { content: '', media: [] },
    });

    return true;
  },
  deletePost: (postId: string) => {
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    }));
  },
  createAnnouncementPost: async () => {
    const { draftPost, posts } = get();
    const companyId = useCompanyStore.getState().companyId;

    if (!draftPost.content.trim() && draftPost.media.length === 0) {
      return false;
    }

    if (!companyId) {
      console.error("❌ No company ID available");
      return false;
    }

    try {
      const announcement = await createCompanyAnnouncementAPI(
        companyId,
        draftPost.content.trim(),
        draftPost.media
      );

      const newPost: CompanyPost = {
        id: announcement.announcement_id.toString(),
        content: announcement.content,
        media: [
          ...announcement.image_urls.map((url: string) => ({
            type: "image",
            file: {} as File,
            preview: url,
          })),
          ...(announcement.video_url
            ? [{
                type: "video",
                file: {} as File,
                preview: announcement.video_url,
              }]
            : []),
        ],
        createdAt: new Date(announcement.created_at),
      };

      set({
        posts: [...posts, newPost],
        draftPost: { content: "", media: [] },
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
      media: [
        ...a.image_urls.map((url: string) => ({
          type: "image",
          file: {} as File,
          preview: url, // now this is a valid remote URL
        })),
        ...(a.video_url
          ? [{
              type: "video",
              file: {} as File,
              preview: a.video_url,
            }]
          : []),
      ],
      createdAt: new Date(a.created_at),
    }));
  
    set({ posts: transformedPosts });
  }
  
  
  
  
}));