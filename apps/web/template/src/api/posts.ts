import API from "./api";
import { Post } from "./types";
import { AxiosResponse } from "axios";

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
  const response = await API.get<NewsFeedResponse>("/post/feed", {
    params: { page, limit },
  });
  return response.data;
};

// Fetch a single post by its ID
// export const fetchPostById = async (postId: number): Promise<GetPostResponse> => {
//   try {
//     const response = await API.get<GetPostResponse>(`/post/${postId}`);
//     return response.data;
//   } catch (error: any) {
//     console.error("❌ fetchPostById error:", error?.response?.data || error.message);
//     throw error;
//   }
// };

// Create a new post with optional media
// export const createPost = async (
//   content: string,
//   mediaUrl?: string,
//   mediaType?: "image" | "video"
// ): Promise<AxiosResponse<CreatePostResponse>> => {
//   const formData = new FormData();
//   formData.append("content", content);
//   formData.append("privacy", "public");

//   if (mediaUrl) {
//     const response = await fetch(mediaUrl);
//     const blob = await response.blob();
//     const ext = mediaType === "video" ? "mp4" : "jpg";
//     const file = new File([blob], `upload.${ext}`, { type: blob.type });

//     formData.append("media", file);
//     formData.append("type", mediaType || "image");
//     formData.append("title", "default title");
//     formData.append("description", "default description");
//   } else {
//     // ✅ Make sure text-only posts still send type/title/description
//     formData.append("type", "text");
//     formData.append("title", "text only");
//     formData.append("description", "no media");
//   }

//   const res = await API.post("/post", formData, {
//     headers: { "Content-Type": "multipart/form-data" }
//   });
  
//   console.log("🧪 Post creation response:", res);
//   return res;
// };

