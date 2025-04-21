import {
  callRPC,
  Events,
  FileMetadataRequestPayload,
  FilePresignedUrlPayload,
  UserProfilePayload,
  getRPCQueueName,
  GetPostByIdPayload,
} from "@shared/rabbitMQ";
import { Services } from "..";
import { FileMetadata, Post } from "@shared/models";

/**
 * Retrieves a post by its ID
 *
 * @param postId - The ID of the post to retrieve
 * @returns The post object if found, null otherwise
 */
export const getPostById = async (postId: number): Promise<Post | null> => {
  try {
    const postRpcQueue = getRPCQueueName(Services.POST, Events.POST_GET_RPC);

    const payload: GetPostByIdPayload.Request = {
      post_id: postId,
    };

    const response = await callRPC<GetPostByIdPayload.Response>(
      postRpcQueue,
      payload
    );

    return response.post;
  } catch (error) {
    console.error(`Error getting post by ID ${postId}:`, error);
    return null;
  }
};
