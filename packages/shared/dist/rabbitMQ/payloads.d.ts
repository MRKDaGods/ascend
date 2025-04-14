import { Profile } from "@shared/models";
/**
 * [RPC] Represents the payload for an admin user request event
 */
export declare namespace AuthGetAdminPayload {
    interface Request {
    }
    interface Response {
        user_id: number;
    }
}
/**
 * [RPC] Represents the payload for an auth FCM token request event
 */
export declare namespace AuthFCMTokenPayload {
    interface Request {
        user_id: number;
    }
    /**
     * @property {string} fcm_token - The user's FCM token
     */
    interface Response {
        user_id: number;
        fcm_token: string;
    }
}
/**
 * Represents the payload for a user creation event
 *
 * @interface UserCreatedPayload
 * @property {number} user_id - The unique identifier for the user
 * @property {string} first_name - The user's first name
 * @property {string} last_name - The user's last name
 * @property {string} email - The user's email address
 */
export interface UserCreatedPayload {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
}
/**
 * [RPC] Represents the payload for a user profile picture request event
 */
export declare namespace UserProfilePicPayload {
    interface Request {
        user_id: number;
    }
    /**
     * @property {string} profile_pic - The URL for the user's profile picture
     */
    interface Response {
        user_id: number;
        profile_pic_url: string;
    }
}
/**
 * [RPC] Represents the payload for a user profile request event
 */
export declare namespace UserProfilePayload {
    interface Request {
        user_id: number;
    }
    interface Response {
        profile: Profile;
    }
}
/**
 * Represents the payload for a file URL request event
 *
 * @property {number} file_id - The unique identifier for the file
 */
export interface FileDeletePayload {
    file_id: number;
}
/**
 * [RPC] Represents the payload for a file URL request event
 */
export declare namespace FilePresignedUrlPayload {
    interface Request {
        file_id: number;
    }
    /**
     * @property {string} presigned_url - The presigned URL for the file
     */
    interface Response {
        file_id: number;
        presigned_url: string;
    }
}
/**
 * [RPC] Represents the payload for a file upload event
 */
export declare namespace FileUploadPayload {
    /**
     * @property {number} user_id - The unique identifier for the user
     * @property {string} file_buffer - The base64 encoded file buffer
     * @property {string} file_name - The name of the file
     * @property {string} mime_type - The MIME type of the file
     * @property {number} file_size - The size of the file in bytes
     * @property {string} [context] - The context of the file
     */
    interface Request {
        user_id: number;
        file_buffer: string;
        file_name: string;
        mime_type: string;
        file_size: number;
        context?: string;
    }
    /**
     * @property {number} file_id - The unique identifier for the file
     */
    interface Response {
        file_id: number;
    }
}
