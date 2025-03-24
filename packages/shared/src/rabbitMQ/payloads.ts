/**
 * Represents the payload for a user creation event.
 *
 * @interface UserCreatedPayload
 * @property {number} user_id - The unique identifier for the user.
 * @property {string} first_name - The user's first name.
 * @property {string} last_name - The user's last name.
 * @property {string} email - The user's email address.
 */
export interface UserCreatedPayload {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface FileDeletePayload {
  file_id: number;
}

export interface FilePresignedUrlRequestPayload {
  file_id: number;
}

export interface FilePresignedUrlResponsePayload {
  file_id: number;
  presigned_url: string;
}

export interface FileUploadRequestPayload {
  user_id: number;
  file_buffer: string; // base64 encoded file buffer
  file_name: string;
  mime_type: string;
  file_size: number;
  context?: string;
}

export interface FileUploadResponsePayload {
  file_id: number;
}