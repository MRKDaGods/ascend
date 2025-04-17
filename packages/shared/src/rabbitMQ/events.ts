export enum Events {
  // =======================AUTH-EVENTS=======================
  AUTH_GET_ADMIN_RPC = "get_admin_rpc", // Admin get user RPC request
  AUTH_FCM_TOKEN_RPC = "fcm_token_rpc", // Auth FCM token RPC request

  // =======================USER-EVENTS=======================
  USER_CREATED = "user_created", // A new user has been created
  USER_PROFILE_PIC_RPC = "profile_pic_rpc", // User profile picture RPC request
  USER_PROFILE_RPC = "profile_rpc", // User profile RPC request

  // =======================FILE-EVENTS=======================
  FILE_URL_RPC = "file_url_rpc",
  FILE_UPLOAD_RPC = "file_upload_rpc",
  FILE_DELETE = "file_delete",
  FILE_METADATA_RPC = "file_metadata_rpc",
}

/**
 * Gets the queue name for the given event locally
 */
export const getQueueName = (event: string) => {
  // Each service has its own queue
  const service = process.env.SERVICE_NAME;
  if (!service) {
    throw new Error("Missing required SERVICE_NAME environment variable");
  }

  return `${service}.${event}.queue`;
};

/**
 * Gets the RPC queue name for the given service and event
 */
export const getRPCQueueName = (rpcHostService: string, event: string) => {
  return `${rpcHostService}.${event}.queue`;
};
