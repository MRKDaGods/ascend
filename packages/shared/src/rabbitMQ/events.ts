export const events = {
  // ------User events------
  USER_CREATED: "user.created", // A new user has been created
  USER_FCM_TOKEN_RPC: "user.fcm_token_rpc", // User FCM token RPC request 

  // ------File events------
  FILE_URL_RPC: "file.url_rpc",
  FILE_UPLOAD_RPC: "file.upload_rpc",
  FILE_DELETE: "file.delete",
};

export const getQueueName = (event: string) => {
  return `${event}.queue`;
};
