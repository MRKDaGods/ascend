
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useMediaStore } from "./useMediaStore";
import {
  fetchNewsFeed,
  fetchPost,
  createPost,
  deletePostById,
  editPost,
  repost,
  createCommentAPI,
  fetchSavedPostsAPI,
  toggleSavePostAPI
} from "@/api/posts";

export type ReactionType =
  | "Like"
  | "Celebrate"
  | "Support"
  | "Love"
  | "Idea"
  | "Funny";

export interface Tag {
  id: number;
  name: string;
}

export type PostType = {
  repostSourcePost?: PostType | null;
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
  commentsList: string[];
  isUserPost?: boolean;
  reaction?: ReactionType;
  tags?: Tag[];
  commentTags?: { [commentIndex: number]: Tag[] };
  fileDescription?: string;
  file?: string | null;
  fileTitle?: string | null;
  isEdited?: boolean;
};

interface PostStoreState {
  posts: PostType[];
  selectedPost: PostType | null;
  lastUserPostId: number | null;
  lastRepostId: number | null;
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
  discardRepostDialogOpen: boolean;
  isLastPostDeleted: boolean;
  repostSourcePost: PostType | null;
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
  openDiscardRepostDialog: () => void;
  closeDiscardPostDialog: () => void;
  closeDiscardRepostDialog: () => void;
  setLastUserPostId: (id: number) => void;
  setLastRepostId: (id: number) => void;
  setLastPostDeleted: (deleted: boolean) => void;
  resetPost: () => void;

  fetchNewsFeedFromAPI: () => Promise<void>;
  fetchPostFromAPI: (id: number) => Promise<void>;
  createPostFromAPI: (
    content: string,
    media?: File,
    mediaType?: "image" | "video" | "file",
    fileTitle?: string,
    fileDescription?: string
  ) => Promise<void>;  
  
  deletePostFromAPI: (postId: number) => Promise<void>;
  editPostFromAPI: (id: number, newText: string) => void;
  repostFromAPI: (postId: number, comment: string) => Promise<void>;
  fetchSavedPostsAPI: (page?: number, limit?: number) => Promise<void>;
  toggleSavePostAPI: (postId: number) => Promise<void>;

  setReaction: (postId: number, reaction: ReactionType) => void;
  clearReaction: (postId: number) => void;
  commentOnPostFromAPI: (postId: number, content: string, parentCommentId?: number | null) => Promise<void>;

  addTagToPost: (postId: number, tag: Tag) => void;
  removeTagFromPost: (postId: number, tagId: number) => void;
  addTagToComment: (postId: number, commentIndex: number, tag: Tag) => void;
  removeTagFromComment: (postId: number, commentIndex: number, tagId: number) => void;
  setRepostSourcePost: (post: PostType | null) => void;

  lastRepostType: "quick" | "with-thoughts" | null;
  setLastRepostType: (type: "quick" | "with-thoughts") => void;
}

export const usePostStore = create<PostStoreState>()(
  persist(
    (set, get) => ({
      posts: [],
      selectedPost: null,
      lastUserPostId: null,
      lastRepostId: null,
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
      discardRepostDialogOpen: false,
      isLastPostDeleted: false,
      postReactions: {},
      repostedPosts: [],
      savedPosts: [],

      lastRepostType: null, 
      setLastRepostType: (type) => set({ lastRepostType: type }),

      setOpen: (open) => set({ open }),
      setPostText: (text) => set({ postText: text }),
      setDraftText: (text) => set({ draftText: text }),
      setEditingPost: (post) => {
        const { setMediaFiles, setMediaPreviews } = useMediaStore.getState();
        const previews: string[] = [];
        if (post?.image) previews.push(post.image);
        if (post?.video) previews.push(post.video);
        setMediaFiles([]);
        setMediaPreviews(previews);
        set({ editingPost: post, postText: post?.content ?? "", open: true });
      },

      setUserPostPopupOpen: (open) => set({ userPostPopupOpen: open }),
      setCopyPostPopupOpen: (val) => set({ copyPostPopupOpen: val }),
      setRepostPopupOpen: (open) => set({ repostPopupOpen: open }),
      setSavedPopupOpen: (open) => set({ savedPopupOpen: open }),
      setUnsavedPopupOpen: (open) => set({ unsavedPopupOpen: open }),
      setDraftSavedPopupOpen: (open) => set({ draftSavedPopupOpen: open }),
      openDiscardPostDialog: () => set({ discardPostDialogOpen: true }),
      openDiscardRepostDialog: () => set({ discardRepostDialogOpen: true }),
      closeDiscardPostDialog: () => set({ discardPostDialogOpen: false }),
      closeDiscardRepostDialog: () => set({ discardRepostDialogOpen: false }),
      setLastUserPostId: (id) => set({ lastUserPostId: id }),
      setLastRepostId: (id) => set({ lastRepostId: id }),
      setLastPostDeleted: (deleted) => set({ isLastPostDeleted: deleted }),
      resetPost: () => set({ open: false, postText: "", editingPost: null }),

      fetchNewsFeedFromAPI: async () => {
        const response = await fetchNewsFeed();
        const posts = (response.data ?? []).reverse().map((post) => ({
          id: post.id,
          username: `${post.user.first_name} ${post.user.last_name}`,
          profilePic: post.user.profile_picture_url ?? "",
          content: post.content,
          followers: "• 1st",
          timestamp: new Date(post.created_at).toLocaleString(),
          likes: post.likes_count,
          reposts: post.shares_count,
          comments: post.comments_count,
          image: post.media?.find((m) => m.type === "image")?.url || undefined,
          video: post.media?.find((m) => m.type === "video")?.url || undefined,
          file: post.media?.find((m) => m.type === "document")?.url || undefined,
          fileTitle: post.media?.find((m) => m.type === "document")?.title || undefined,
          commentsList: [],
          isUserPost: false,
          repostSourcePost: null,
        }));
      
        set({ posts });
      },
      
      fetchPostFromAPI: async (postId) => {
        try {
          const { data: post } = await fetchPost(postId);
      
          let repostSourcePost: PostType | null = null;
      
          // 🌟 If this post is a repost, fetch the original
          if (post.original_post) {
            const { data: source } = await fetchPost(post.original_post.id);
            repostSourcePost = {
              id: source.id,
              username: `${source.user.first_name} ${source.user.last_name}`,
              profilePic: source.user.profile_picture_url ?? "",
              content: source.comment || source.content || "",
              followers: "• 1st",
              timestamp: new Date(source.created_at).toLocaleString(),
              likes: source.likes_count,
              reposts: source.shares_count,
              comments: source.comments_count,
              image: source.media?.find((m) => m.type === "image")?.url || undefined,
              video: source.media?.find((m) => m.type === "video")?.url || undefined,
              file: source.media?.find((m) => m.type === "document")?.url || undefined, // ✅ PDF file URL
              fileTitle: source.media?.find((m) => m.type === "document")?.title || undefined, // ✅ PDF Title
              commentsList: [],
              isUserPost: false,
              repostSourcePost: null,
              isEdited: source.is_edited,
            };
          }
      
          const mapped: PostType = {
            id: post.id,
            username: `${post.user.first_name} ${post.user.last_name}`,
            profilePic: post.user.profile_picture_url ?? "",
            content: post.comment || post.content || "",
            followers: "• 1st",
            timestamp: new Date(post.created_at).toLocaleString(),
            likes: post.likes_count,
            reposts: post.shares_count,
            comments: post.comments_count,
            image: post.media?.find((m) => m.type === "image")?.url || undefined,
            video: post.media?.find((m) => m.type === "video")?.url || undefined,
            file: post.media?.find((m) => m.type === "document")?.url || undefined,
            fileTitle: post.media?.find((m) => m.type === "document")?.title || undefined,
            commentsList: [],
            isUserPost: true,
            repostSourcePost,
            isEdited: post.is_edited,
          };
      
          set({ selectedPost: mapped, isLastPostDeleted: false });
        } catch (err: any) {
          console.error("❌ fetchPostById error:", err?.response?.data || err.message);
        }
      },      

      createPostFromAPI: async (
        content,
        media,
        mediaType,
        fileTitle,
        fileDescription
      ) => {
        try {
          console.log("📦 Creating post with:", {
            content,
            media,
            mediaType,
            fileTitle,
            fileDescription,
          });
      
          const response = await createPost(content, media, mediaType, fileTitle, fileDescription);
          const id = response.data?.data?.id;
      
          if (id) {
            set({ lastUserPostId: id, userPostPopupOpen: true, isLastPostDeleted: false });
          }
        } catch (error) {
          console.error("❌ Error in createPostFromAPI:", error);
          throw error;
        }
      },      

      deletePostFromAPI: async (postId) => {
        await deletePostById(postId);
        set((s) => ({
          posts: s.posts.filter((p) => p.id !== postId),
          isLastPostDeleted: true,
        }));
      },

      editPostFromAPI: async (postId, content) => {
        await editPost(postId, content);
        const { data: post } = await fetchPost(postId);
        set({
          selectedPost: {
            id: post.id,
            username: `${post.user.first_name} ${post.user.last_name}`,
            profilePic: post.user.profile_picture_url ?? "",
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
          },
          lastUserPostId: postId,
        });
      },

      repostFromAPI: async (postId, comment) => {
        try {
          const res = await repost(postId, comment);
          const shared = res.data.data;
      
          const backendGeneratedPostId = shared.post_id;
      
          // Find the original post (to attach in preview)
          const original = get().posts.find((p) => p.id === postId);
      
          // Build the new repost structure
          const mapped: PostType = {
            id: backendGeneratedPostId,
            username: "You",
            profilePic: "/man.jpg",
            content: shared.comment, // this may be empty string
            followers: "• 1st",
            timestamp: new Date(shared.created_at).toLocaleString(),
            likes: 0,
            reposts: 0,
            comments: 0,
            commentsList: [],
            isUserPost: true,
            repostSourcePost: original || null,
          };
      
          // Determine type of repost
          const repostType = shared.comment?.trim() ? "with-thoughts" : "quick";
      
          // Update Zustand store
          set({
            posts: [...get().posts, mapped],
            lastRepostId: backendGeneratedPostId,
            lastRepostType: repostType, // <-- 👈 track repost type
            repostPopupOpen: true,
            selectedPost: mapped,
          });
        } catch (err: any) {
          console.error("❌ Error during repostFromAPI:", err?.response?.data || err.message);
        }
      },

      fetchSavedPostsAPI: async () => {
        try {
          const savedData = await fetchSavedPostsAPI();
          const mapped = savedData.map((post) => ({
            id: post.id,
            username: `${post.user.first_name} ${post.user.last_name}`,
            profilePic: post.user.profile_picture_url ?? "",
            content: post.content,
            followers: "• 1st",
            timestamp: new Date(post.created_at).toLocaleString(),
            likes: post.likes_count,
            reposts: post.shares_count,
            comments: post.comments_count,
            image: post.media?.find((m: any) => m.type === "image")?.url,
            video: post.media?.find((m: any) => m.type === "video")?.url,
            commentsList: [],
            isUserPost: false,
          }));
      
          const ids = mapped.map((p) => p.id);
          set((s) => ({
            posts: [...s.posts, ...mapped.filter((p) => !s.posts.some((x) => x.id === p.id))],
            savedPosts: [...new Set([...s.savedPosts, ...ids])],
          }));
        } catch (error) {
          console.error("❌ Failed to fetch saved posts from API", error);
        }
      },      
      
      toggleSavePostAPI: async (postId) => {
        try {
          const saved = await toggleSavePostAPI(postId); // ⬅️ This now gives us true = saved, false = unsaved
      
          set((s) => ({
            savedPosts: saved
              ? [...new Set([...s.savedPosts, postId])]
              : s.savedPosts.filter((id) => id !== postId),
            savedPopupOpen: saved,
            unsavedPopupOpen: !saved,
          }));
      
          console.log(`✅ Post ${postId} is now ${saved ? "saved" : "unsaved"}`);
        } catch (err: any) {
          console.error("❌ Failed to save/unsave post:", err?.response?.data || err.message);
        }
      },      
      
      setReaction: (postId, reaction) =>
        set((s) => ({
          postReactions: { ...s.postReactions, [postId]: reaction },
          posts: s.posts.map((p) =>
            p.id === postId && !s.postReactions[postId] ? { ...p, likes: p.likes + 1 } : p
          ),
        })),

      clearReaction: (postId) =>
        set((s) => {
          const { [postId]: _, ...rest } = s.postReactions;
          return {
            postReactions: rest,
            posts: s.posts.map((p) =>
              p.id === postId ? { ...p, likes: p.likes - 1 } : p
            ),
          };
        }),
      
      commentOnPostFromAPI: async (postId, content, parentCommentId = null) => {
        try {
          const response = await createCommentAPI(postId, content, parentCommentId);
          console.log("✅ Comment created:", response.data);
          // Optional: Append comment to selectedPost.commentsList or refetch post/comments
        } catch (error: any) {
          console.error("❌ Failed to create comment:", error?.response?.data || error.message);
        }
      },      

      addTagToPost: (postId, tag) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === postId ? { ...p, tags: p.tags ? [...p.tags, tag] : [tag] } : p
          ),
        })),
      removeTagFromPost: (postId, tagId) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === postId ? { ...p, tags: p.tags?.filter((t) => t.id !== tagId) || [] } : p
          ),
        })),
      addTagToComment: (postId, i, tag) =>
        set((s) => ({
          posts: s.posts.map((p) => {
            if (p.id !== postId) return p;
            const tags = { ...p.commentTags, [i]: [...(p.commentTags?.[i] || []), tag] };
            return { ...p, commentTags: tags };
          }),
        })),
      removeTagFromComment: (postId, i, tagId) =>
        set((s) => ({
          posts: s.posts.map((p) => {
            if (p.id !== postId) return p;
            const tags = { ...p.commentTags, [i]: p.commentTags?.[i]?.filter((t) => t.id !== tagId) || [] };
            return { ...p, commentTags: tags };
          }),
        })),

      repostSourcePost: null,
      setRepostSourcePost: (post) => set({ repostSourcePost: post }),
    }),
    {
      name: "post-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ 
        posts: s.posts,
        savedPosts: s.savedPosts,
      }),
    }
  )
);
