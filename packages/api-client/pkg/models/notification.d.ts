export declare enum NotificationType {
    WELCOME = "welcome"
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
