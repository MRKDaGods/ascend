export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
  DOCUMENT = "document",
  LINK = "link",
}
export enum ReportReason {
  SPAM = "spam",
  HARASSMENT = "harassment",
  VIOLENCE = "violence",
  HATE_SPEECH = "hate_speech",
  MISINFORMATION = "misinformation",
  OTHER = "other",
}

export interface Report {
  // Reports for inappropriate content
  id: number;
  reporter_id: number;
  post_id: number;
  reason: ReportReason;
  comment?: string;
  created_at: Date;
}

export interface Media {
  // 1:N with Post
  id: number;
  post_id: number;
  url: string;
  type: MediaType;
  thumbnail_url: string | null;
  title: string | null;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Post {
  // 1:N with User
  id: number;
  user_id: number;
  content: string;
  is_edited: boolean;
  privacy: PostPrivacy;
  created_at: Date;
  updated_at: Date;
  // Injected properties
  media?: Media[];
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
  user?: UserBrief;
}

export type PostPrivacy = "public" | "connections" | "private";

export interface UserBrief {
  id: number;
  first_name: string;
  last_name: string;
  profile_picture_url: string | null;
}

export interface Like {
  // M:N between User and Post
  id: number;
  user_id: number;
  post_id: number;
  created_at: Date;
}

export interface Comment {
  // 1:N with Post, self-referential for replies
  id: number;
  post_id: number;
  user_id: number;
  parent_comment_id?: number; // For nested comments
  content: string;
  is_edited: boolean;
  created_at: Date;
  updated_at: Date;
  user?: {
    // Injected
    id: number;
    first_name: string;
    last_name: string;
    profile_picture_url?: string;
  };
  replies?: Comment[]; // Injected for nested comments
}

export interface Share {
  // Reposts
  id: number;
  user_id: number;
  post_id: number;
  shared_post_id?: number; // If sharing another share
  comment?: string; // Optional comment when sharing
  created_at: Date;
}

export interface UserTag {
  // M:N between User and Post/Comment
  id: number;
  user_id: number;
  post_id?: number;
  comment_id?: number;
  created_at: Date;
}

export interface SavedPost {
  // M:N between User and Post
  id: number;
  user_id: number;
  post_id: number;
  created_at: Date;
}

export interface PostEngagement {
  post_id: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  last_updated: Date;
}

export interface FeedItemType {
  type: "post" | "share" | "recommendation";
  item: Post | Share;
  created_at: Date;
}
