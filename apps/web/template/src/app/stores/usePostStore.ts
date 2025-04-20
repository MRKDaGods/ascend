
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
  file?: string;
  commentsList: string[];
  isUserPost?: boolean;
  reaction?: ReactionType;
  tags?: Tag[];
  commentTags?: { [commentIndex: number]: Tag[] };
  fileTitle?: string;
  fileDescription?: string;
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
    media?: string,
    mediaType?: "image" | "video"
  ) => Promise<void>;
  deletePostFromAPI: (postId: number) => Promise<void>;
  editPostFromAPI: (id: number, newText: string) => void;
  repostFromAPI: (postId: number, comment: string) => Promise<void>;

  setReaction: (postId: number, reaction: ReactionType) => void;
  clearReaction: (postId: number) => void;
  toggleSavePost: (id: number) => void;
  commentOnPost: (id: number, comment: string) => void;
  deleteComment: (postId: number, commentIndex: number) => void;
  addTagToPost: (postId: number, tag: Tag) => void;
  removeTagFromPost: (postId: number, tagId: number) => void;
  addTagToComment: (postId: number, commentIndex: number, tag: Tag) => void;
  removeTagFromComment: (postId: number, commentIndex: number, tagId: number) => void;
  setRepostSourcePost: (post: PostType | null) => void;
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
        const posts = (response.data ?? []).map((post) => ({
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
          isUserPost: false,
          repostSourcePost: null,
        }));
        set({ posts });
      },
      fetchPostFromAPI: async (postId) => {
        try {
          const { data: post } = await fetchPost(postId);
      
          const mapMedia = (mediaArray?: any[]) => ({
            image: mediaArray?.find((m) => m.type === "image")?.url,
            video: mediaArray?.find((m) => m.type === "video")?.url,
            fileTitle: mediaArray?.[0]?.title ?? "",
            fileDescription: mediaArray?.[0]?.description ?? "",
          });
      
          // Optional chaining in case it's not a repost
          const repostSourcePost = post.original_post
            ? {
                id: post.original_post.id,
                username: `${post.original_post.user.first_name} ${post.original_post.user.last_name}`,
                profilePic: post.original_post.user.profile_picture_url ?? "",
                content: post.original_post.content,
                followers: "• 1st",
                timestamp: new Date(post.original_post.created_at).toLocaleString(),
                likes: post.original_post.likes_count,
                reposts: post.original_post.shares_count,
                comments: post.original_post.comments_count,
                commentsList: [],
                isUserPost: false,
                ...mapMedia(post.original_post.media),
                isEdited: post.original_post.is_edited,
              }
            : null;
      
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
            commentsList: [],
            isUserPost: true,
            ...mapMedia(post.media),
            isEdited: post.is_edited,
            repostSourcePost,
          };
      
          set({ selectedPost: mapped });
        } catch (err: any) {
          console.error("❌ fetchPostById error:", err?.response?.data || err.message);
        }
      },      

      createPostFromAPI: async (content, media, type) => {
        const response = await createPost(content, media, type);
        const id = response.data?.data?.id;
        if (id) set({ lastUserPostId: id, userPostPopupOpen: true });
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
        const res = await repost(postId, comment);
        const shared = res.data.data;
      
        const backendGeneratedPostId = shared.post_id; // ✅ this is what we care about
      
        const original = get().posts.find((p) => p.id === postId);
      
        const mapped: PostType = {
          id: backendGeneratedPostId, // ✅ real backend post ID
          username: "You",
          profilePic: "/man.jpg",
          content: shared.comment,
          followers: "• 1st",
          timestamp: new Date(shared.created_at).toLocaleString(),
          likes: 0,
          reposts: 0,
          comments: 0,
          commentsList: [],
          isUserPost: true,
          repostSourcePost: original || null,
        };
      
        console.log("✅ Correct Post ID from backend:", backendGeneratedPostId);
      
        set({
          posts: [...get().posts, mapped],
          lastRepostId: backendGeneratedPostId,
          repostPopupOpen: true,
          selectedPost: mapped,
        });
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

      toggleSavePost: (id) =>
        set((s) => {
          const isSaved = s.savedPosts.includes(id);
          return {
            savedPosts: isSaved ? s.savedPosts.filter((pid) => pid !== id) : [...s.savedPosts, id],
            savedPopupOpen: !isSaved,
            unsavedPopupOpen: isSaved,
          };
        }),

      commentOnPost: (id, comment) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === id ? { ...p, comments: p.comments + 1, commentsList: [...p.commentsList, comment] } : p
          ),
        })),

      deleteComment: (postId, i) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === postId
              ? { ...p, comments: p.comments - 1, commentsList: p.commentsList.filter((_, idx) => idx !== i) }
              : p
          ),
        })),

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
      partialize: (s) => ({ posts: s.posts }),
    }
  )
);
