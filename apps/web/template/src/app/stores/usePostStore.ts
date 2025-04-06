import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export type ReactionType = "Like" | "Celebrate" | "Support" | "Love" | "Idea" | "Funny";

const generateNumericId = () => {
  return parseInt(uuidv4().replace(/-/g, "").substring(0, 12), 16);
};

export interface Tag {
  id: number;
  name: string;
}

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
  reaction?: ReactionType;
  tags?: Tag[]; // ✅ Post tags
  commentTags?: { [commentIndex: number]: Tag[] }; // ✅ Comment-specific tags
};

interface PostStoreState {
  open: boolean;
  postText: string;
  userPostPopupOpen: boolean;
  savedPopupOpen: boolean;
  unsavedPopupOpen: boolean;
  draftSavedPopupOpen: boolean;
  lastUserPostId: number | null;
  isLastPostDeleted: boolean;
  discardPostDialogOpen: boolean;
  draftText: string;

  posts: PostType[];
  repostedPosts: number[];
  savedPosts: number[];
  postReactions: { [postId: number]: ReactionType };

  editingPost: PostType | null;

  setOpen: (open: boolean) => void;
  setPostText: (text: string) => void;

  setUserPostPopupOpen: (open: boolean) => void;
  setSavedPopupOpen: (open: boolean) => void;
  setUnsavedPopupOpen: (open: boolean) => void;
  setDraftSavedPopupOpen: (open: boolean) => void;

  setLastUserPostId: (id: number) => void;
  setLastPostDeleted: (deleted: boolean) => void;
  setDraftText: (text: string) => void;
  resetPost: () => void;
  

  addPost: (content: string, media?: string, mediaType?: "image" | "video") => void;
  deletePost: (postId: number) => void;
  editPost: (id: number, newText: string) => void;
  setEditingPost: (post: PostType | null) => void;

  setReaction: (postId: number, reaction: ReactionType) => void;
  clearReaction: (postId: number) => void;

  repostPost: (id: number) => void;
  toggleSavePost: (id: number) => void;

  commentOnPost: (id: number, comment: string) => void;
  deleteComment: (postId: number, commentIndex: number) => void;

  addTagToPost: (postId: number, tag: Tag) => void;
  removeTagFromPost: (postId: number, tagId: number) => void;
  addTagToComment: (postId: number, commentIndex: number, tag: Tag) => void;
  removeTagFromComment: (postId: number, commentIndex: number, tagId: number) => void;

  openDiscardPostDialog: () => void;
  closeDiscardPostDialog: () => void;
}

export const usePostStore = create<PostStoreState>()(
  persist(
    (set, get) => ({
      open: false,
      postText: "",
      userPostPopupOpen: false,
      savedPopupOpen: false,
      unsavedPopupOpen: false,
      draftSavedPopupOpen: false,
      lastUserPostId: null,
      isLastPostDeleted: false,
      editingPost: null,
      postReactions: {},
      discardPostDialogOpen: false,
      draftText: "",

      posts: [],

      repostedPosts: [],
      savedPosts: [],

      setOpen: (open) => set({ open }),
      setPostText: (text) => set({ postText: text }),
      setUserPostPopupOpen: (open) => set({ userPostPopupOpen: open }),
      setSavedPopupOpen: (open) => set({ savedPopupOpen: open }),
      setUnsavedPopupOpen: (open) => set({ unsavedPopupOpen: open }),
      setDraftSavedPopupOpen: (open) => set({draftSavedPopupOpen: open}),
      setLastUserPostId: (id) => set({ lastUserPostId: id }),
      setLastPostDeleted: (deleted) => set({ isLastPostDeleted: deleted }),
      setDraftText: (text: string) => set({ draftText: text }),

      openDiscardPostDialog: () => set({ discardPostDialogOpen: true }),
      closeDiscardPostDialog: () => set({ discardPostDialogOpen: false }),

      resetPost: () => set({ open: false, postText: "", editingPost: null }),
      draftPost: () => {
        set((state) => ({
          draftText: state.postText,
          open: false,
          postText: "",
          editingPost: null,
        }));
      },
      

      addPost: (content, media, mediaType) =>
        set((state) => {
          const newPost: PostType = {
            id: generateNumericId(), //id generator, converted to number not string
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
            tags: [],
            commentTags: {},
          };
          return {
            posts: [...state.posts, newPost],
            userPostPopupOpen: true,
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
            post.id === postId && !state.postReactions[postId]
              ? { ...post, likes: post.likes + 1 }
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
              post.id === id
                ? { ...post, reposts: isReposted ? post.reposts - 1 : post.reposts + 1 }
                : post
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

      addTagToPost: (postId, tag) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  tags: post.tags ? [...post.tags, tag] : [tag],
                }
              : post
          ),
        })),

      removeTagFromPost: (postId, tagId) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  tags: post.tags?.filter((t) => t.id !== tagId) || [],
                }
              : post
          ),
        })),

      addTagToComment: (postId, commentIndex, tag) =>
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id !== postId) return post;
            const updatedTags = {
              ...post.commentTags,
              [commentIndex]: [...(post.commentTags?.[commentIndex] || []), tag],
            };
            return { ...post, commentTags: updatedTags };
          }),
        })),

      removeTagFromComment: (postId, commentIndex, tagId) =>
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id !== postId) return post;
            const updatedTags = {
              ...post.commentTags,
              [commentIndex]: post.commentTags?.[commentIndex]?.filter((t) => t.id !== tagId) || [],
            };
            return { ...post, commentTags: updatedTags };
          }),
        })),
    }),
    {
      name: "post-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
