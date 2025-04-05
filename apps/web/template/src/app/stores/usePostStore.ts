import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type PostType = {
  id: number;
  username: string;
  profilePic: string;
  content: string;
  followers: string;
  timestamp: string;
  likes: number;
  reposts: number;
  comments: number;
  image?: string;
  video?: string;
  file?: string;
  commentsList: string[];
  isUserPost?: boolean;
};

type ReactionType = "like" | "clap" | "support" | "love" | "idea" | "funny";

interface PostStoreState {
  open: boolean;
  postText: string;
  popupOpen: boolean;
  savedPopupOpen: boolean;
  unsavedPopupOpen: boolean;
  lastUserPostId: number | null;
  isLastPostDeleted: boolean;

  posts: PostType[];
  likedPosts: number[];
  repostedPosts: number[];
  savedPosts: number[];
  postReactions: { [postId: number]: ReactionType }; // ✅ NEW

  editingPost: PostType | null;

  setOpen: (open: boolean) => void;
  setPostText: (text: string) => void;
  setPopupOpen: (open: boolean) => void;
  setSavedPopupOpen: (open: boolean) => void;
  setUnsavedPopupOpen: (open: boolean) => void;
  setLastUserPostId: (id: number) => void;
  setLastPostDeleted: (deleted: boolean) => void;
  resetPost: () => void;

  addPost: (content: string, media?: string, mediaType?: "image" | "video") => void;
  deletePost: (postId: number) => void;
  editPost: (id: number, newText: string) => void;
  setEditingPost: (post: PostType | null) => void;

  setReaction: (postId: number, reaction: ReactionType) => void; // ✅ NEW
  clearReaction: (postId: number) => void; // ✅ NEW

  repostPost: (id: number) => void;
  toggleSavePost: (id: number) => void;

  commentOnPost: (id: number, comment: string) => void;
  deleteComment: (postId: number, commentIndex: number) => void;
}

export const usePostStore = create<PostStoreState>()(
  persist(
    (set, get) => ({
      open: false,
      postText: "",
      popupOpen: false,
      savedPopupOpen: false,
      unsavedPopupOpen: false,
      lastUserPostId: null,
      isLastPostDeleted: false,
      editingPost: null,

      posts: [ /* initial posts */ ],
      likedPosts: [],
      repostedPosts: [],
      savedPosts: [],
      postReactions: {},

      setOpen: (open) => set({ open }),
      setPostText: (text) => set({ postText: text }),
      setPopupOpen: (open) => set({ popupOpen: open }),
      setSavedPopupOpen: (open) => set({ savedPopupOpen: open }),
      setUnsavedPopupOpen: (open) => set({ unsavedPopupOpen: open }),
      setLastUserPostId: (id) => set({ lastUserPostId: id }),
      setLastPostDeleted: (deleted) => set({ isLastPostDeleted: deleted }),

      resetPost: () => set({ open: false, postText: "", editingPost: null }),

      addPost: (content, media, mediaType) =>
        set((state) => {
          const newPost: PostType = {
            id: Date.now(),
            profilePic: "/profile.jpg",
            username: "User",
            followers: "You",
            timestamp: "Just now",
            content,
            image: mediaType === "image" ? media : undefined,
            video: mediaType === "video" ? media : undefined,
            likes: 0,
            comments: 0,
            reposts: 0,
            commentsList: [],
            isUserPost: true,
          };
          return {
            posts: [...state.posts, newPost],
            popupOpen: true,
            lastUserPostId: newPost.id,
            isLastPostDeleted: false,
          };
        }),

      deletePost: (postId) =>
        set((state) => ({
          posts: state.posts.filter((post) => !(post.id === postId && post.isUserPost)),
        })),

      editPost: (id, newText) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id ? { ...post, content: newText } : post
          ),
          editingPost: null,
          postText: "",
          open: false,
        })),

      setEditingPost: (post) =>
        set({
          editingPost: post,
          postText: post?.content ?? "",
          open: true,
        }),

      setReaction: (postId, reaction) =>
        set((state) => ({
          postReactions: {
            ...state.postReactions,
            [postId]: reaction,
          },
          posts: state.posts.map((post) =>
            post.id === postId
              ? { ...post, likes: state.postReactions[postId] ? post.likes : post.likes + 1 }
              : post
          ),
        })),

      clearReaction: (postId) =>
        set((state) => {
          const { [postId]: _, ...rest } = state.postReactions;
          return {
            postReactions: rest,
            posts: state.posts.map((post) =>
              post.id === postId ? { ...post, likes: post.likes - 1 } : post
            ),
          };
        }),

      repostPost: (id) =>
        set((state) => {
          const isReposted = state.repostedPosts.includes(id);
          return {
            repostedPosts: isReposted
              ? state.repostedPosts.filter((pid) => pid !== id)
              : [...state.repostedPosts, id],
            posts: state.posts.map((post) =>
              post.id === id ? { ...post, reposts: isReposted ? post.reposts - 1 : post.reposts + 1 } : post
            ),
          };
        }),

      toggleSavePost: (id) =>
        set((state) => {
          const isSaved = state.savedPosts.includes(id);
          return {
            savedPosts: isSaved
              ? state.savedPosts.filter((pid) => pid !== id)
              : [...state.savedPosts, id],
            savedPopupOpen: !isSaved,
            unsavedPopupOpen: isSaved,
          };
        }),

      commentOnPost: (id, comment) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id
              ? {
                  ...post,
                  comments: post.comments + 1,
                  commentsList: [...post.commentsList, comment],
                }
              : post
          ),
        })),

      deleteComment: (postId, commentIndex) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: post.comments - 1,
                  commentsList: post.commentsList.filter((_, i) => i !== commentIndex),
                }
              : post
          ),
        })),
    }),
    {
      name: "post-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
