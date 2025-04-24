import API from "./api";
import { AxiosResponse } from "axios";
import { Post } from "./types";

// ==== RESPONSE INTERFACES ====

export interface NewsFeedResponse {
  success: boolean;
  data: Post[];
}

export interface GetPostResponse {
  success: boolean;
  data: Post;
}

export interface CreatePostResponse {
  success: boolean;
  data: Post;
}

export interface DeletePostResponse {
  success: boolean;
  message: string;
}

export interface EditPostResponse {
  success: boolean;
  data: Post;
}

export interface RepostResponse {
  success: boolean;
  data: {
    id: number;
    user_id: number;
    post_id: number;
    comment: string;
    created_at: string;
  };
}

export interface GetSavedPostsResponse {
  success: boolean;
  data: Post[];
}

// ==== FETCH FEED ====

export const fetchNewsFeed = async (
  page = 1,
  limit = 15
): Promise<NewsFeedResponse> => {
  const response = await API.get<NewsFeedResponse>("/post/feed", {
    params: { page, limit },
  });
  return response.data;
};

// ==== FETCH SINGLE POST ====

export const fetchPost = async (
  postId: number
): Promise<GetPostResponse> => {
  try {
    const response = await API.get<GetPostResponse>(`/post/${postId}`);
    return response.data;
  } catch (error: any) {
    console.error("❌ fetchPost error:", error?.response?.data || error.message);
    throw error;
  }
};

// ==== CREATE POST ====

export const createPost = async (
  content: string,
  mediaUrl?: string,
  mediaType?: "image" | "video"
): Promise<AxiosResponse<CreatePostResponse>> => {
  const formData = new FormData();
  formData.append("content", content);
  formData.append("privacy", "public");

  if (mediaUrl) {
    const response = await fetch(mediaUrl);
    const blob = await response.blob();
    const ext = mediaType === "video" ? "mp4" : "jpg";
    const file = new File([blob], `upload.${ext}`, { type: blob.type });

    formData.append("media", file);
    formData.append("type", mediaType || "image");
  } else {
    formData.append("title", "text only");
    formData.append("description", "no media");
  }

  const res = await API.post("/post", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-no-parse-body": "1",
    },
  });

  return res;
};

// ==== DELETE POST ====

export const deletePostById = async (
  postId: number
): Promise<DeletePostResponse> => {
  const response = await API.delete<DeletePostResponse>(`/post/${postId}`);
  return response.data;
};

// ==== EDIT POST ====

export const editPost = async (
  postId: number,
  content: string,
  privacy: "public" | "private" = "public"
): Promise<AxiosResponse<EditPostResponse>> => {
  const formData = new FormData();
  formData.append("content", content);
  formData.append("privacy", privacy);

  const res = await API.patch(`/post/${postId}`, formData, {
    headers: {
      "x-no-parse-body": "1",
    },
  });

  return res;
};

// ==== REPOST ====

export const repost = async (
  postId: number,
  comment: string,
  privacy: "public" | "private" = "public"
): Promise<AxiosResponse<RepostResponse>> => {
  const formData = new FormData();
  formData.append("comment", comment);
  formData.append("privacy", privacy);

  const res = await API.post(`/post/${postId}/share`, formData, {
    headers: {
      "x-no-parse-body": "1",
    },
  });

  return res;
};

// ==== TOGGLE SAVE/UNSAVE POST ====
export const toggleSavePostAPI = async (postId: number): Promise<boolean> => {
  const response = await API.post(`/post/${postId}/save`);
  return response.data?.data?.saved ?? false;
};


// ==== FETCH ALL SAVED POSTS ====

export const fetchSavedPostsAPI = async (): Promise<Post[]> => {
  const response = await API.get("/post/saved");
  return response.data.data; // already returns an array of posts
};

// ==== CREATE COMMENT ON POST ====

export const createCommentAPI = async (
  postId: number,
  content: string,
  parentCommentId?: number | null
): Promise<any> => {
  const formData = new FormData();
  formData.append("content", content);
  if (parentCommentId !== undefined && parentCommentId !== null) {
    formData.append("parentCommentId", parentCommentId.toString());
  }

  const res = await API.post(`/post/${postId}/comments`, formData, {
    headers: {
      "x-no-parse-body": "1",
    },
  });

  return res.data;
};
