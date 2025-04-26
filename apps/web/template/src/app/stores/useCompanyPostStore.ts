import { create } from 'zustand';

export interface MediaFile {
  type: 'image' | 'video' | 'document';
  file: File;
  preview: string;
}

export interface Post {
  id: string;
  content: string;
  media: MediaFile[];
  createdAt: Date;
}

interface PostStore {
  posts: Post[];
  draftPost: {
    content: string;
    media: MediaFile[];
  };
  setDraftPostContent: (content: string) => void;
  addDraftMedia: (mediaArray: MediaFile[]) => void;
  removeDraftMedia: (index: number) => void;
  clearDraftPost: () => void;
  addPost: () => boolean;
  deletePost: (postId: string) => void; // Added deletePost method
}

export const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  draftPost: {
    content: '',
    media: [],
  },
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

    const newPost: Post = {
      id: Date.now().toString(),
      content: draftPost.content.trim(),
      media: draftPost.media,
      createdAt: new Date(),
    };

    // Add the new post to the posts array without replacing existing posts
    set({
      posts: [...posts, newPost], // Ensure posts are appended
      draftPost: { content: '', media: [] }, // Reset draft after post
    });

    return true;
  },
  deletePost: (postId: string) => {
    // Delete the post by filtering out the post with the matching id
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    }));
  },
}));
