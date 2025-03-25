import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ✅ Define Post Type
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

// ✅ Define Zustand Store Type
interface PostStoreState {
  open: boolean;
  postText: string;
  popupOpen: boolean;
  lastUserPostId: number | null,

  setOpen: (open: boolean) => void;
  setPostText: (text: string) => void;
  setPopupOpen: (open: boolean) => void;
  setLastUserPostId: (id: number) => void;

  resetPost: () => void;

  posts: PostType[];
  likedPosts: number[];
  repostedPosts: number[];
  editingPost: PostType | null;

  addPost: (content: string, media?: string, mediaType?: "image" | "video") => void;
  deletePost: (postId: number) => void;

  likePost: (id: number) => void;
  repostPost: (id: number) => void;
  commentOnPost: (id: number, comment: string) => void;
  deleteComment: (postId: number, commentIndex: number) => void;

  setEditingPost: (post: PostType | null) => void;
  editPost: (id: number, newText: string) => void;
}

// ✅ Zustand Store with Persistence
export const usePostStore = create<PostStoreState>()(
  persist(
    (set, get) => ({
      open: false,
      postText: "",
      popupOpen: false,
      lastUserPostId: null,

      setOpen: (open) => set(() => ({ open })),
      setPostText: (text) => set(() => ({ postText: text })),
      setPopupOpen: (open) => set(() => ({ popupOpen: open })),

      resetPost: () => set(() => ({ open: false, postText: "" })),
      setLastUserPostId: (id: number) => set({ lastUserPostId: id }),

      posts: [
        {
          id: 1,
          profilePic: "/man.jpg",
          username: "John Doe",
          followers: "500+ connections",
          timestamp: "2h ago",
          content: "Excited to share my latest project! 🚀",
          image: "/post.jpg",
          likes: 34,
          comments: 12,
          reposts: 5,
          commentsList: ["Awesome work!", "Looks great!"],
          isUserPost: false,
        },
        {
          id: 2,
          profilePic: "/profile2.jpg",
          username: "Jane Smith",
          followers: "1,200 followers",
          timestamp: "1d ago",
          content: "Feature works doesn’t mean you're done. 😅",
          image: "/post1.jpg",
          likes: 89,
          comments: 23,
          reposts: 10,
          commentsList: ["Looks like fun!", "Wish I was there!"],
          isUserPost: false,
        },
      ],

      likedPosts: [],
      repostedPosts: [],

      // ✅ Add a new post
      addPost: (content: string, media?: string, mediaType?: "image" | "video") =>
        set((state) => {
          const newPost: PostType = {
            id: Math.floor(Math.random() * 1000000),
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
            ...state,
            posts: [...state.posts, newPost],
            popupOpen: true,
            lastUserPostId: newPost.id
          };
        }),

      // ✅ Delete only user-created posts
      deletePost: (postId: number) =>
        set((state) => ({
          ...state,
          posts: state.posts.filter((post) => !(post.id === postId && post.isUserPost)),
        })),

      // ✅ Like/Unlike a post
      likePost: (id: number) =>
        set((state) => {
          const isLiked = state.likedPosts.includes(id);
          return {
            ...state,
            likedPosts: isLiked
              ? state.likedPosts.filter((postId) => postId !== id)
              : [...state.likedPosts, id],
            posts: state.posts.map((post) =>
              post.id === id
                ? { ...post, likes: isLiked ? post.likes - 1 : post.likes + 1 }
                : post
            ),
          };
        }),

      // ✅ Repost/Undo repost
      repostPost: (id: number) =>
        set((state) => {
          const isReposted = state.repostedPosts.includes(id);
          return {
            ...state,
            repostedPosts: isReposted
              ? state.repostedPosts.filter((postId) => postId !== id)
              : [...state.repostedPosts, id],
            posts: state.posts.map((post) =>
              post.id === id
                ? { ...post, reposts: isReposted ? post.reposts - 1 : post.reposts + 1 }
                : post
            ),
          };
        }),

      // ✅ Add a comment
      commentOnPost: (id: number, comment: string) =>
        set((state) => ({
          ...state,
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

      // ✅ Delete a comment
      deleteComment: (postId: number, commentIndex: number) =>
        set((state) => ({
          ...state,
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

        editingPost: null,

        setEditingPost: (post) => set(() => ({ editingPost: post, open: true, postText: post?.content ?? "" })),

        editPost: (id, newText) =>
          set((state) => ({
            posts: state.posts.map((post) =>
              post.id === id ? { ...post, content: newText } : post
            ),
            editingPost: null, // Clear edit mode
            postText: "",       // Clear input
            open: false,        // Close dialog
          })),


    }),
    {
      name: "post-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
