// apps/web/template/src/app/api/types.ts

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  profile_picture_url?: string | null;
}

export interface Media {
  id: number;
  post_id: number;
  url: string;
  type: "image" | "video" | "document" | "link";
  title: string;
  description: string;
}

export interface Post {
  id: number;
  user_id: number;
  content: string;
  is_edited: boolean;
  privacy: string;
  created_at: string;
  updated_at: string;
  user: User;
  media: Media[];
  likes_count: number;
  comments_count: number;
  shares_count: number;
}
