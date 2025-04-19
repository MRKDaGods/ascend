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

export const fetchNewsFeed = async (page = 1, limit = 15): Promise<NewsFeedResponse> => {
  const response = await API.get<NewsFeedResponse>("/feed", {
    params: { page, limit },
  });

  return response.data;
};

export const fetchPostById = async (postId: number): Promise<GetPostResponse> => {
  try {
    const response = await API.get<GetPostResponse>(`/${postId}`);
    return response.data;
  } catch (error: any) {
    console.error("❌ fetchPostById error:", error?.response?.data || error.message);
    throw error;
  }
};

