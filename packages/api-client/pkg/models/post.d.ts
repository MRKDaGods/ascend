export declare enum MediaType {
    IMAGE = "image",
    VIDEO = "video",
    DOCUMENT = "document",
    LINK = "link"
}
export declare enum ReportReason {
    SPAM = "spam",
    HARASSMENT = "harassment",
    VIOLENCE = "violence",
    HATE_SPEECH = "hate_speech",
    MISINFORMATION = "misinformation",
    OTHER = "other"
}
export interface Report {
    id: number;
    reporter_id: number;
    post_id: number;
    reason: ReportReason;
    comment?: string;
    created_at: Date;
}
export interface Media {
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
    id: number;
    user_id: number;
    content: string;
    is_edited: boolean;
    privacy: PostPrivacy;
    created_at: Date;
    updated_at: Date;
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
    id: number;
    user_id: number;
    post_id: number;
    created_at: Date;
}
export interface Comment {
    id: number;
    post_id: number;
    user_id: number;
    parent_comment_id?: number;
    content: string;
    is_edited: boolean;
    created_at: Date;
    updated_at: Date;
    user?: {
        id: number;
        first_name: string;
        last_name: string;
        profile_picture_url?: string;
    };
    replies?: Comment[];
}
export interface Share {
    id: number;
    user_id: number;
    post_id: number;
    shared_post_id?: number;
    comment?: string;
    created_at: Date;
}
export interface UserTag {
    id: number;
    user_id: number;
    post_id?: number;
    comment_id?: number;
    created_at: Date;
}
export interface SavedPost {
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
