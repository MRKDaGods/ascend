// api/posts.ts

import API from "./api";
import { Post } from "./types";

interface NewsFeedResponse {
  success: boolean;
  data: Post[];
}

interface GetPostResponse {
  success: boolean;
  data: Post;
}

interface CreatePostResponse {
  success: boolean;
  data: Post;
}

// Fetch all posts for the news feed
export const fetchNewsFeed = async (page = 1, limit = 15): Promise<NewsFeedResponse> => {
  const response = await API.get<NewsFeedResponse>("/feed", {
    params: { page, limit },
  });
  return response.data;
};

// Fetch a single post by its ID
export const fetchPostById = async (postId: number): Promise<GetPostResponse> => {
  try {
    const response = await API.get<GetPostResponse>(`/${postId}`);
    return response.data;
  } catch (error: any) {
    console.error("❌ fetchPostById error:", error?.response?.data || error.message);
    throw error;
  }
};

// Create a new post with optional media
export const createPost = async (
  content: string,
  mediaUrl?: string,
  mediaType?: "image" | "video"
): Promise<CreatePostResponse> => {
  const formData = new FormData();
  formData.append("content", content);

  if (mediaUrl) {
    const response = await fetch(mediaUrl);
    const blob = await response.blob();
    const ext = mediaType === "video" ? "mp4" : "jpg";
    const file = new File([blob], `upload.${ext}`, { type: blob.type });

    formData.append("media", file);
    formData.append("title", "create new post yea"); // required
    formData.append("description", "double checking"); // required
  }

  const response = await API.post<CreatePostResponse>("", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};