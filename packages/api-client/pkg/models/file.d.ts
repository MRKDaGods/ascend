export interface FileMetadata {
    id: number;
    user_id: number;
    file_name: string;
    mime_type: string;
    file_size: number;
    context?: string;
    created_at: Date;
    updated_at: Date;
}
