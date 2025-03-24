export const events = {
  // ------User events------

  // Called when a new user is created
  // Auth -> User
  USER_CREATED: "user.created",

  // ------File events------
  FILE_URL_RPC: "file.url_rpc",
  FILE_UPLOAD_RPC: "file.upload_rpc",
  FILE_DELETE: "file.delete",
};

export const getQueueName = (event: string) => {
  return `${event}.queue`;
};
