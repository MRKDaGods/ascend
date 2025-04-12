export declare enum NotificationType {
    WELCOME = "welcome",// Sent when a new user is created
    LIKE = "like",// Sent when a user likes a post
    COMMENT = "comment",// Sent when a user comments on a post
    FOLLOW = "follow",// Sent when a user follows another user
    MENTION = "mention",// Sent when a user mentions another user in a comment
    CONNECTION = "connection"
}
export interface Notification {
    id: number;
    user_id: number;
    type: NotificationType;
    message: string;
    payload?: any;
    is_read?: boolean;
    created_at?: Date;
    updated_at?: Date;
}
