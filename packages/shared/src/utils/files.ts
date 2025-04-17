import {
  callRPC,
  Events,
  FileMetadataRequestPayload,
  FilePresignedUrlPayload,
  getRPCQueueName,
} from "@shared/rabbitMQ";
import { Services } from "..";
import { FileMetadata } from "@shared/models";

/**
 * Retrieves a presigned URL for a file
 *
 * @param fileId - The ID of the file to retrieve the URL for
 * @returns The presigned URL
 */
export const getPresignedUrl = async (
  fileId: number | null
): Promise<string | null> => {
  if (!fileId) {
    return null;
  }

  try {
    const fileRpcQueue = getRPCQueueName(Services.FILE, Events.FILE_URL_RPC);
    const payload: FilePresignedUrlPayload.Request = {
      file_id: fileId,
    };

    const response = await callRPC<FilePresignedUrlPayload.Response>(
      fileRpcQueue,
      payload
    );

    return response.presigned_url;
  } catch (error) {
    console.error(`Error getting presigned URL for file ${fileId}:`, error);
    return null;
  }
};

/**
 * Retrieves metadata for a file
 *
 * @param fileId - The ID of the file to retrieve metadata for
 * @returns The file metadata or null if not found
 */
export const getFileMetadata = async (
  fileId: number): Promise<FileMetadata | null> => {
  try {
    const fileRpcQueue = getRPCQueueName(Services.FILE, Events.FILE_METADATA_RPC);
    const payload: FileMetadataRequestPayload.Request = {
      file_id: fileId,
    };

    const response = await callRPC<FileMetadataRequestPayload.Response>(
      fileRpcQueue,
      payload
    );

    return response.file_metadata;
  } catch (error) {
    console.error(`Error getting metadata for file ${fileId}:`, error);
    return null;
  }
};