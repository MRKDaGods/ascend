export const events = {
  // ------User events------

  // Called when a new user is created
  // Auth -> User
  USER_CREATED: "user.created",

  // ------File events------
  FILE_URL_RPC: "file.url_rpc",
  FILE_UPLOAD_RPC: "file.upload_rpc",
  FILE_DELETE: "file.delete",

  
  // -------Job events---------------
  JOB_CREATED : "job.created",

  // -------Job application event----
  JOB_APPLICATION_STATUS_UPDATED : "job_application.updated",

  // ---Company made announcement----
  COMPANY_ANNOUNCEMENT : "company.announcement",
  IS_COMPANY_CREATOR : "company.is_creator",
  GET_COMPANY_FOLLOWERS : "company.followers"
};

export const getQueueName = (event: string) => {
  return `${event}.queue`;
};
