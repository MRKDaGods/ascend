import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ✅ Define PostType
export interface PostType {
  id: number;
  profilePic: string;
  username: string;
  followers: string;
  timestamp: string;
  content: string;
  image?: string; // ✅ Ensure this is optional
  media?: string; // ✅ Supports images, videos, documents
  likes: number;
  comments: number;
  reposts: number;
  commentsList: string[];
  isUserPost?: boolean; // ✅ New Field

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
  addPost: (content: string, media?: string) => void;
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
      setOpen: (open: boolean) => set({ open }),
      setPostText: (text: string) => set({ postText: text }),
      resetPost: () => set({ open: false, postText: "" }),

      // ✅ Dummy Posts
      posts: [
        {
          id: 1,
          profilePic: "/man.jpg",
          username: "John Doe",
          followers: "500+ connections",
          timestamp: "2h ago",
          content: "Excited to share my latest project! 🚀",
          media: "/post.jpg",
          likes: 34,
          comments: 12,
          reposts: 5,
          commentsList: ["Awesome work!", "Looks great!"],
        },
        {
          id: 2,
          profilePic: "/profile2.jpg",
          username: "Jane Smith",
          followers: "1,200 followers",
          timestamp: "1d ago",
          content: "Had an amazing time at the tech conference! 🔥",
          media: "/mock-image2.jpg",
          likes: 89,
          comments: 23,
          reposts: 10,
          commentsList: ["Looks like fun!", "Wish I was there!"],
        },
      ],
      likedPosts: [],
      repostedPosts: [],

      // ✅ Add Post (Supports Media)
      addPost: (content: string, media?: string) =>
        set((state) => ({
          posts: [
            {
              id: Date.now(),
              profilePic: "/profile.jpg",
              username: "Ascend Developer",
              followers: "You",
              timestamp: "Just now",
              content,
              media: media || "", // ✅ Store media if available
              likes: 0,
              comments: 0,
              reposts: 0,
              commentsList: [],
            },
            ...state.posts, // ✅ Newest posts appear first
          ],
        })),

      // ✅ Like/Unlike Post
      likePost: (id: number) =>
        set((state) => {
          const isLiked = state.likedPosts.includes(id);
          return {
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

      // ✅ Repost/Unrepost Post
      repostPost: (id: number) =>
        set((state) => {
          const isReposted = state.repostedPosts.includes(id);
          return {
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

      // ✅ Add Comment to Post
      commentOnPost: (id: number, comment: string) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id
              ? { ...post, comments: post.comments + 1, commentsList: [...post.commentsList, comment] }
              : post
          ),
        })),

      // ✅ Delete Comment from Post
      deleteComment: (postId: number, commentIndex: number) =>
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
      name: "post-storage", // ✅ Persist data in `localStorage`
      storage: createJSONStorage(() => localStorage), // ✅ JSON format storage
    }
  )
);

