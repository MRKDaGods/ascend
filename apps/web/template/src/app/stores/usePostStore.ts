import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { useMediaStore } from "./useMediaStore";
import { fetchNewsFeed, fetchPostById } from "@/api/posts";
import API from "@/api/api";

export type ReactionType = "Like" | "Celebrate" | "Support" | "Love" | "Idea" | "Funny";

// const generateNumericId = () => {
//   return parseInt(uuidv4().replace(/-/g, "").substring(0, 12), 16);
// };

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
  fileTitle?: string;
  commentsList: string[];
  isUserPost?: boolean;
  reaction?: ReactionType;
  tags?: Tag[];
  commentTags?: { [commentIndex: number]: Tag[] };
};

interface PostStoreState {
  posts: PostType[];
  selectedPost: PostType | null;
  lastUserPostId: number | null;

  open: boolean;
  postText: string;
  draftText: string;
  editingPost: PostType | null;

  userPostPopupOpen: boolean;
  copyPostPopupOpen: boolean;
  repostPopupOpen: boolean;
  savedPopupOpen: boolean;
  unsavedPopupOpen: boolean;
  draftSavedPopupOpen: boolean;
  discardPostDialogOpen: boolean;
  isLastPostDeleted: boolean;

  postReactions: { [postId: number]: ReactionType };
  repostedPosts: number[];
  savedPosts: number[];

  setOpen: (open: boolean) => void;
  setPostText: (text: string) => void;
  setDraftText: (text: string) => void;
  setEditingPost: (post: PostType | null) => void;

  setUserPostPopupOpen: (open: boolean) => void;
  setCopyPostPopupOpen: (val: boolean) => void;
  setRepostPopupOpen: (open: boolean) => void;
  setSavedPopupOpen: (open: boolean) => void;
  setUnsavedPopupOpen: (open: boolean) => void;
  setDraftSavedPopupOpen: (open: boolean) => void;
  openDiscardPostDialog: () => void;
  closeDiscardPostDialog: () => void;

  setLastUserPostId: (id: number) => void;
  setLastPostDeleted: (deleted: boolean) => void;
  resetPost: () => void;

  fetchNewsFeed: () => Promise<void>;
  fetchPost: (id: number) => Promise<void>;

  createPostViaAPI: (content: string, media?: string, mediaType?: "image" | "video") => Promise<void>;

  // addPost: (content: string, media?: string, mediaType?: "image" | "video", document?: { url: string; title: string }) => void;
  deletePost: (postId: number) => void;
  editPost: (id: number, newText: string, newMedia?: string, mediaType?: "image" | "video") => void;

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
}

export const usePostStore = create<PostStoreState>()(
  persist(
    (set, get) => ({
      posts: [],
      selectedPost: null,
      lastUserPostId: null,

      open: false,
      postText: "",
      draftText: "",
      editingPost: null,

      userPostPopupOpen: false,
      copyPostPopupOpen: false,
      repostPopupOpen: false,
      savedPopupOpen: false,
      unsavedPopupOpen: false,
      draftSavedPopupOpen: false,
      discardPostDialogOpen: false,
      isLastPostDeleted: false,

      postReactions: {},
      repostedPosts: [],
      savedPosts: [],

      setOpen: (open) => set({ open }),
      setPostText: (text) => set({ postText: text }),
      setDraftText: (text) => set({ draftText: text }),
      setEditingPost: (post) => {
        const { setMediaFiles, setMediaPreviews } = useMediaStore.getState();
        const mediaPreviews: string[] = [];
        if (post?.image) mediaPreviews.push(post.image);
        if (post?.video) mediaPreviews.push(post.video);

        set({ editingPost: post, postText: post?.content ?? "", open: true });
        setMediaFiles([]);
        setMediaPreviews(mediaPreviews);
      },

      setUserPostPopupOpen: (open) => set({ userPostPopupOpen: open }),
      setCopyPostPopupOpen: (val) => set({ copyPostPopupOpen: val }),
      setRepostPopupOpen: (open) => set({ repostPopupOpen: open }),
      setSavedPopupOpen: (open) => set({ savedPopupOpen: open }),
      setUnsavedPopupOpen: (open) => set({ unsavedPopupOpen: open }),
      setDraftSavedPopupOpen: (open) => set({ draftSavedPopupOpen: open }),
      openDiscardPostDialog: () => set({ discardPostDialogOpen: true }),
      closeDiscardPostDialog: () => set({ discardPostDialogOpen: false }),

      setLastUserPostId: (id) => set({ lastUserPostId: id }),
      setLastPostDeleted: (deleted) => set({ isLastPostDeleted: deleted }),
      resetPost: () => set({ open: false, postText: "", editingPost: null }),

      fetchNewsFeed: async () => {
        try {
          const response = await fetchNewsFeed();
          const mappedPosts = (response.data ?? []).map((post) => ({
            id: post.id,
            username: `${post.user.first_name} ${post.user.last_name}`,
            profilePic: post.user.profile_picture_url || "/profile.jpg",
            content: post.content,
            followers: "• 1st",
            timestamp: new Date(post.created_at).toLocaleString(),
            likes: post.likes_count,
            reposts: post.shares_count,
            comments: post.comments_count,
            image: post.media?.find((m) => m.type === "image")?.url,
            video: post.media?.find((m) => m.type === "video")?.url,
            commentsList: [],
            isUserPost: false,
          }));

          set({ posts: mappedPosts });
        } catch (error) {
          console.error("Failed to fetch news feed:", error);
        }
      },

      fetchPost: async (id) => {
        try {
          const response = await fetchPostById(id);
          const post = response.data;
          const mappedPost: PostType = {
            id: post.id,
            username: `${post.user.first_name} ${post.user.last_name}`,
            profilePic: post.user.profile_picture_url || "/profile.jpg",
            content: post.content,
            followers: "• 1st",
            timestamp: new Date(post.created_at).toLocaleString(),
            likes: post.likes_count,
            reposts: post.shares_count,
            comments: post.comments_count,
            image: post.media?.find((m) => m.type === "image")?.url,
            video: post.media?.find((m) => m.type === "video")?.url,
            commentsList: [],
            isUserPost: true,
          };

          set({ selectedPost: mappedPost });
        } catch (err) {
          console.error("fetchPostById error:", err);
        }
      },

      createPostViaAPI: async (content, mediaUrl, mediaType) => {
        try {
          const formData = new FormData();
          formData.append("content", content);
      
          if (mediaUrl) {
            const response = await fetch(mediaUrl);
            const blob = await response.blob();
            const ext = mediaType === "video" ? "mp4" : "jpg";
            const file = new File([blob], `upload.${ext}`, { type: blob.type });
      
            formData.append("media", file);
            formData.append("title", "create new post yea"); // ✅ required by backend
            formData.append("description", "double checking"); // ✅ required by backend
          }
      
          const response = await API.post("", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
      
          console.log("✅ Post created:", response.data);
          set({ lastUserPostId: response.data.id });
        } catch (err) {
          console.error("❌ Failed to create post:", err);
        }
      },
      
      

      // addPost: (content, media, mediaType, document) =>
      //   set((state) => {
      //     const newPost: PostType = {
      //       id: generateNumericId(),
      //       profilePic: "/profile.jpg",
      //       username: "User",
      //       followers: "You",
      //       timestamp: "Just now",
      //       content,
      //       image: mediaType === "image" ? media : undefined,
      //       video: mediaType === "video" ? media : undefined,
      //       file: document?.url,
      //       fileTitle: document?.title,
      //       likes: 0,
      //       comments: 0,
      //       reposts: 0,
      //       commentsList: [],
      //       isUserPost: true,
      //       tags: [],
      //       commentTags: {},
      //     };

      //     return {
      //       posts: [...state.posts, newPost],
      //       userPostPopupOpen: true,
      //       lastUserPostId: newPost.id,
      //       isLastPostDeleted: false,
      //     };
      //   }),

      deletePost: (postId) =>
        set((state) => ({
          posts: state.posts.filter((post) => !(post.id === postId && post.isUserPost)),
        })),

      editPost: (id, newText, newMedia, mediaType) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id
              ? {
                  ...post,
                  content: newText,
                  image: mediaType === "image" ? newMedia : post.image,
                  video: mediaType === "video" ? newMedia : post.video,
                }
              : post
          ),
          editingPost: null,
          postText: "",
          open: false,
        })),

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
                ? {
                    ...post,
                    reposts: isReposted ? post.reposts - 1 : post.reposts + 1,
                  }
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
      partialize: (state) => ({
        posts: state.posts,
      }),
    }
  )
);
