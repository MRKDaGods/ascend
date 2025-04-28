/**
 * Retrieves a presigned URL for a file
 *
 * @param fileId - The ID of the file to retrieve the URL for
 * @returns The presigned URL
 */
export declare const getPresignedUrl: (fileId: number | null) => Promise<string | null>;
