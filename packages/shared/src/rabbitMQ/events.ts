export const events = {
  // ------User events------

  // Called when a new user is created
  // Auth -> User
  USER_CREATED: "user.created",

  // ------File events------
  FILE_DELETED: "file.deleted",
};

export const getQueueName = (event: string) => {
  return `${event}.queue`;
};
