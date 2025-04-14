import API from "@/api/api"; // Adjust the import path as necessary
import { Post } from "./types";

interface NewsFeedResponse {
  success: boolean;
  data: Post[];
}

export const fetchNewsFeed = async (page = 1, limit = 15): Promise<NewsFeedResponse> => {
  const response = await API.get<NewsFeedResponse>("/feed", {
    params: { page, limit },
  });

  return response.data;
};
