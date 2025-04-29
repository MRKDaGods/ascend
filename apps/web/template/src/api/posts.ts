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

export interface GetCommentsResponse {
  success: boolean;
  data: any[]; // You can replace `any` later with your real Comment type
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface UltimateSearchResponse {
  success: boolean;
  data: {
    users: {
      id: number;
      first_name: string;
      last_name: string;
      profile_picture_id: number | null;
      bio: string | null;
      rank: number;
      profile_picture_url: string | null;
    }[];
    posts: {
      id: number;
      content: string;
      is_edited: boolean;
      privacy: "public" | "private";
      created_at: string;
      updated_at: string;
      rank: number;
      user: {
        id: number;
        first_name: string;
        last_name: string;
        profile_picture_url: string | null;
      };
      media: {
        id: number;
        post_id: number;
        url: string;
        type: string;
        thumbnail_url: string | null;
        title: string;
        description: string;
        created_at: string;
        updated_at: string;
      }[];
      likes_count: number;
      comments_count: number;
      shares_count: number;
    }[];
  };
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
  mediaFile?: File,
  mediaType?: "image" | "video" | "file",
  fileTitle?: string,
  fileDescription?: string
): Promise<AxiosResponse<CreatePostResponse>> => {
  const formData = new FormData();
  formData.append("content", content);
  formData.append("privacy", "public");

  if (mediaFile && mediaType === "file") {
    formData.append("media", mediaFile);
    formData.append("type", "document");
    formData.append("title", fileTitle ?? "Untitled Document");
    formData.append("description", fileDescription ?? "PDF file");
    console.log("📄 Document being uploaded:", mediaFile.name);
  } else if (mediaFile && (mediaType === "image" || mediaType === "video")) {
    formData.append("media", mediaFile);
    formData.append("type", mediaType);
    formData.append("title", "Uploaded Media");
    formData.append("description", `${mediaType} file`);
    console.log("🖼️ Media being uploaded:", mediaFile.name);
  } else {
    formData.append("title", "text only");
    formData.append("description", "no media");
    console.log("📝 Text-only post");
  }

  return await API.post("/post", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-no-parse-body": "1",
    },
  });
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
  return response.data.data;
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

  // ==== GET COMMENTS ON POST ====

  const res = await API.post(`/post/${postId}/comments`, formData, {
    headers: {
      "x-no-parse-body": "1",
    },
  });

  return res.data;
};

  // ==== GET COMMENTS ON POST ====

export const fetchCommentsForPost = async (
  postId: number,
  page = 1,
  limit = 10
): Promise<GetCommentsResponse> => {
  const response = await API.get<GetCommentsResponse>(`/post/${postId}/comments`, {
    params: { page, limit },
  });
  return response.data;
};

// ==== ULTIMATE SEARCH ====

// Fetch function

export const ultimateSearchAPI = async (
  q: string,
  limit = 5,
  offset = 0
): Promise<UltimateSearchResponse> => {
  const response = await API.get<UltimateSearchResponse>(`/post/search/ultimate`, {
    params: { q, limit, offset },
  });
  return response.data;
};
