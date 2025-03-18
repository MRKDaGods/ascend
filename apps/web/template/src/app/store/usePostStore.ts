import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ✅ Define Post Type
export interface PostType {
  id: number;
  profilePic: string;
  username: string;
  followers: string;
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  reposts: number;
  commentsList: string[];
  isUserPost: boolean; // ✅ Distinguishes user-created posts
}

// ✅ Define Zustand Store Type
interface PostStoreState {
  open: boolean;
  postText: string;
  setOpen: (open: boolean) => void;
  setPostText: (text: string) => void;
  resetPost: () => void;

  posts: PostType[];
  likedPosts: number[];
  repostedPosts: number[];
  
  addPost: (content: string, image?: string) => void;
  deletePost: (postId: number) => void;

  likePost: (id: number) => void;
  repostPost: (id: number) => void;
  commentOnPost: (id: number, comment: string) => void;
  deleteComment: (postId: number, commentIndex: number) => void;
}

// ✅ Zustand Store with Persistence
export const usePostStore = create<PostStoreState>()(
  persist(
    (set, get) => ({
      open: false,
      postText: "",
      setOpen: (open) => set(() => ({ open })),
      setPostText: (text) => set(() => ({ postText: text })),
      resetPost: () => set(() => ({ open: false, postText: "" })),

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
          content: "Had an amazing time at the tech conference! 🔥",
          image: "/mock-image2.jpg",
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
      addPost: (content: string, image?: string) =>
        set((state) => {
          const newPost: PostType = {
            id: Date.now(),
            profilePic: "/profile.jpg",
            username: "User",
            followers: "You",
            timestamp: "Just now",
            content,
            image: image || "",
            likes: 0,
            comments: 0,
            reposts: 0,
            commentsList: [],
            isUserPost: true, // ✅ Mark as user-created
          };
          return { ...state, posts: [newPost, ...state.posts] };
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
              ? { ...post, comments: post.comments + 1, commentsList: [...post.commentsList, comment] }
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
    }),
    {
      name: "post-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
