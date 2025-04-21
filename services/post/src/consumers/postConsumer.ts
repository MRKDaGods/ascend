import { GetPostByIdPayload } from "@shared/rabbitMQ";
import postService from "../services/postService";

/**
 * Handles the get_post_rpc event
 **/
export const handleGetPostRequestRPC = async (
  payload: GetPostByIdPayload.Request
): Promise<GetPostByIdPayload.Response | null> => {
  console.log("Received get_post_rpc event:", payload);

  const post_id = payload.post_id;
  if (!post_id) {
    console.error("Invalid post ID");
    return null;
  }

  // Get post by ID
  const post = await postService.getPostById(post_id);
  if (!post) {
    console.error(`Failed to retrieve post ${post_id}`);
    return null;
  }

  console.log(`Retrieved post ${post_id}`);

  const response: GetPostByIdPayload.Response = {
    post,
  };
  return response;
};
