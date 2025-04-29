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

interface TagUserRequest {
  contentType: "post" | "comment";
  contentId: number;
  tags: {
    userId: number;
    startIndex: number;
    endIndex: number;
  }[];
}

interface TagUserResponse {
  success: boolean;
  data: {
    contentType: "post" | "comment";
    contentId: number;
    tags: {
      id: number;
      tagged_user_id: number;
      tagger_user_id: number;
      post_id: number | null;
      comment_id: number | null;
      start_index: number;
      end_index: number;
      created_at: string;
    }[];
  };
}

// ================================================================================================= //

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
  mediaFiles?: File[],
  mediaType?: "image" | "video" | "file" | "text",
  fileTitle?: string,
  fileDescription?: string
): Promise<AxiosResponse<CreatePostResponse>> => {
  const formData = new FormData();

  formData.append("content", content);
  formData.append("privacy", "public");

  if (mediaFiles && mediaFiles.length > 0 && mediaType) {
    mediaFiles.forEach((file) => {
      formData.append("media", file); // ✅ supports multiple
    });

    formData.append("type", mediaType === "file" ? "document" : mediaType);
    formData.append("title", fileTitle ?? "Untitled");
    formData.append("description", fileDescription ?? "No description");

    console.log(`📁 Uploading ${mediaFiles.length} files of type: ${mediaType}`);
  } else {
    // No media case
    formData.append("type", "text");
    formData.append("title", "Text only");
    formData.append("description", "No media attached");

    console.log("📝 Creating text-only post");
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

// ==== TAG USERS ON POST OR COMMENT ====

export const tagUsersAPI = async (payload: TagUserRequest): Promise<TagUserResponse> => {
  const response = await API.post<TagUserResponse>("/post/tags", payload);
  return response.data;
};

export const tagUsersOnContentAPI = async (contentType: "post" | "comment", contentId: number, tags: { userId: number; startIndex: number; endIndex: number }[]) => {
  const res = await API.post(`/tags`, {
    contentType,
    contentId,
    tags,
  });
  return res.data;
};

// ==== CREATE REACTION ON POST ====

export const reactToPostAPI = async (postId: number, type: string) => {
  const response = await API.post(`/post/${postId}/react`, { type }, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};