import db from "@shared/config/db";
import { JobReport, PostReport } from "packages/shared/src/models/report";
import { getPostById } from "@shared/utils/post";
import { getPresignedUrl } from "@shared/utils/files";
import { Job } from "@shared/models/job";
import { Post } from "@shared/models";

/**
 * Interface for paginated response data
 * @template T - Type of data being paginated
 */
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    nextPage: number | null;
    previousPage: number | null;
  };
}

/**
 * Checks if a user has admin privileges
 * @param userId - The ID of the user to check
 * @returns A promise that resolves to a boolean indicating if the user is an admin
 * @throws Error if the database query fails
 */
export const isAdmin = async (userId: number): Promise<boolean> => {
  try {
    const query = `
      SELECT COUNT(*) AS count
      FROM auth_service.users
      WHERE id = $1 AND role = 'admin'
    `;
    const values = [userId];
    const result = await db.query(query, values);
    const count = parseInt(result.rows[0].count);
    return count > 0;
  } catch (error) {
    console.error("Error in isAdmin:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Verifies if a job report with the specified ID exists
 * @param reportId - The ID of the job report to check
 * @returns A promise that resolves to a boolean indicating if the report exists
 * @throws Error if the database query fails
 */
export const isThereJobReportWithId = async (
  reportId: number
): Promise<boolean> => {
  try {
    const query = `
      SELECT COUNT(*) AS count
      FROM job_service.reports
      WHERE id = $1
    `;
    const values = [reportId];
    const result = await db.query(query, values);
    const count = parseInt(result.rows[0].count);
    return count > 0;
  } catch (error) {
    console.error("Error in isThereJobReportWithId:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Verifies if a job with the specified ID exists
 * @param jobId - The ID of the job to check
 * @returns A promise that resolves to a boolean indicating if the job exists
 * @throws Error if the database query fails
 */
export const isThereJobWithId = async (jobId: number): Promise<boolean> => {
  try {
    const query = `
      SELECT COUNT(*) AS count
      FROM job_service.jobs
      WHERE job_id = $1
    `;
    const values = [jobId];
    const result = await db.query(query, values);
    const count = parseInt(result.rows[0].count);
    return count > 0;
  } catch (error) {
    console.error("Error in isThereJobWithId:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Verifies if a post report with the specified ID exists
 * @param reportId - The ID of the post report to check
 * @returns A promise that resolves to a boolean indicating if the report exists
 * @throws Error if the database query fails
 */
export const isTherePostReportWithId = async (
  reportId: number
): Promise<boolean> => {
  try {
    const query = `
      SELECT COUNT(*) AS count
      FROM post_service.reports
      WHERE id = $1
    `;
    const values = [reportId];
    const result = await db.query(query, values);
    const count = parseInt(result.rows[0].count);
    return count > 0;
  } catch (error) {
    console.error("Error in isTherePostReportWithId:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Verifies if a post with the specified ID exists
 * @param postId - The ID of the post to check
 * @returns A promise that resolves to a boolean indicating if the post exists
 * @throws Error if the database query fails
 */
export const isTherePostWithId = async (postId: number): Promise<boolean> => {
  try {
    const query = `
      SELECT COUNT(*) AS count
      FROM post_service.posts
      WHERE id = $1
    `;
    const values = [postId];
    const result = await db.query(query, values);
    const count = parseInt(result.rows[0].count);
    return count > 0;
  } catch (error) {
    console.error("Error in isTherePostWithId:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Retrieves a paginated list of jobs that have been reported
 * @param pageNumber - The page number for pagination
 * @returns A promise that resolves to a paginated response containing reported jobs
 * @throws Error if the database query fails
 */
export const getReportedJobs = async (
  pageNumber: number
): Promise<PaginatedResponse<Job>> => {
  try {
    // Pagination constants
    const PAGE_SIZE = 20; // Number of results per page
    const OFFSET = (pageNumber - 1) * PAGE_SIZE; // Offset based on page number

    const countQuery = `
      SELECT COUNT(DISTINCT job_id) AS total
      FROM job_service.reports
    `;

    const countResult = await db.query(countQuery);

    const totalRecords = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalRecords / PAGE_SIZE);
    const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
    const previousPage = pageNumber > 1 ? pageNumber - 1 : null;
    const paginationMetadata = {
      totalRecords,
      totalPages,
      currentPage: pageNumber,
      nextPage,
      previousPage,
    };

    const query = `
      SELECT DISTINCT ON (j.job_id) j.*, c.company_name, c.profile_photo_id
      FROM job_service.reports AS r
      JOIN job_service.jobs AS j ON r.job_id = j.job_id
      JOIN company_service.company AS c ON j.company_id = c.company_id
      ORDER BY j.job_id
      LIMIT $1 OFFSET $2
    `;
    const values = [PAGE_SIZE, OFFSET];
    const result = await db.query(query, values);

    const reportedJobs = await Promise.all(
      result.rows.map(async (row) => {
        // Fetch company logo URL
        const company_logo_url = await getPresignedUrl(row.profile_photo_id);
        return {
          job_id: row.job_id,
          title: row.title,
          description: row.description,
          industry: row.industry,
          type: row.type,
          experience_level: row.experience_level,
          location: row.location,
          workplace_type: row.workplace_type,
          salary_min_range: row.salary_min_range,
          salary_max_range: row.salary_max_range,
          company_id: row.company_id,
          company_name: row.company_name,
          company_logo_url,
          created_at: row.created_at,
        };
      })
    );

    return {
      data: reportedJobs,
      pagination: paginationMetadata,
    };
  } catch (error) {
    console.error("Error in getReportedJobs:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Retrieves a paginated list of reports for a specific job
 * @param jobId - The ID of the job to get reports for
 * @param pageNumber - The page number for pagination
 * @returns A promise that resolves to a paginated response containing job reports
 * @throws Error if the database query fails
 */
export const getJobReports = async (
  jobId: number,
  pageNumber: number
): Promise<PaginatedResponse<JobReport>> => {
  try {
    // Pagination constants
    const PAGE_SIZE = 20; // Number of results per page
    const OFFSET = (pageNumber - 1) * PAGE_SIZE; // Offset based on page number

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM job_service.reports
      WHERE job_id = $1
    `;
    const countValues = [jobId];

    const countResult = await db.query(countQuery, countValues);

    const totalRecords = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalRecords / PAGE_SIZE);
    const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
    const previousPage = pageNumber > 1 ? pageNumber - 1 : null;
    const paginationMetadata = {
      totalRecords,
      totalPages,
      currentPage: pageNumber,
      nextPage,
      previousPage,
    };

    const query = `
      SELECT r.*, u.first_name, u.last_name, u.profile_picture_id
      FROM job_service.reports AS r
      JOIN user_service.profiles AS u ON r.reporter_id = u.user_id
      WHERE r.job_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const values = [jobId, PAGE_SIZE, OFFSET];

    const result = await db.query(query, values);

    const reportedJobs = await Promise.all(
      result.rows.map(async (row) => {
        // Fetch reporter profile photo URL
        const profile_picture_url = await getPresignedUrl(
          row.profile_picture_id
        );

        return {
          id: row.id,
          reporter_id: row.reporter_id,
          reporter_full_name: `${row.first_name} ${row.last_name}`,
          reporter_profile_picture: profile_picture_url,
          reason: row.reason,
          status: row.status,
          created_at: row.created_at,
        };
      })
    );

    return {
      data: reportedJobs,
      pagination: paginationMetadata,
    };
  } catch (error) {
    console.error("Error in getJobReports:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Updates the status of a job report
 * @param reportId - The ID of the report to update
 * @param status - The new status to set
 * @returns A promise that resolves to a boolean indicating if the update was successful
 * @throws Error if the database query fails
 */
export const updateJobReportStatus = async (
  reportId: number,
  status: string
): Promise<boolean> => {
  try {
    const query = `
      UPDATE job_service.reports
      SET status = $1
      WHERE id = $2
      RETURNING id
    `;
    const values = [status, reportId];
    const result = await db.query(query, values);
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error in updateJobReportStatus:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Deletes a job from the database
 * @param jobId - The ID of the job to delete
 * @returns A promise that resolves to a boolean indicating if the deletion was successful
 * @throws Error if the database query fails
 */
export const deleteJob = async (jobId: number): Promise<boolean> => {
  try {
    const query = `
      DELETE FROM job_service.jobs
      WHERE job_id = $1
      RETURNING job_id
    `;
    const values = [jobId];
    const result = await db.query(query, values);
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error in deleteJob:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Gets the count of job reports, optionally filtered by date
 * @param startDate - Optional date to filter reports created on or after this date
 * @returns A promise that resolves to the number of job reports
 * @throws Error if the database query fails
 */
export const getJobReportsCount = async (startDate?: Date): Promise<number> => {
  try {
    let query = `
      SELECT COUNT(*) AS count
      FROM job_service.reports
    `;

    const values: Date[] = [];

    // If startDate is provided, add WHERE clause to filter by date
    if (startDate) {
      query += `
        WHERE created_at >= $1
      `;
      values.push(startDate);
    }

    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error("Error in getJobReportsCount:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Gets the count of jobs, optionally filtered by date
 * @param startDate - Optional date to filter jobs created on or after this date
 * @returns A promise that resolves to the number of jobs
 * @throws Error if the database query fails
 */
export const getJobsCount = async (startDate?: Date): Promise<number> => {
  try {
    let query = `
      SELECT COUNT(*) AS count
      FROM job_service.jobs
    `;

    const values: Date[] = [];

    // If startDate is provided, add WHERE clause to filter by date
    if (startDate) {
      query += `
        WHERE created_at >= $1
      `;
      values.push(startDate);
    }

    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error("Error in getJobsCount:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Gets the count of users, optionally filtered by date
 * @param startDate - Optional date to filter users created on or after this date
 * @returns A promise that resolves to the number of users
 * @throws Error if the database query fails
 */
export const getUsersCount = async (startDate?: Date): Promise<number> => {
  try {
    let query = `
      SELECT COUNT(*) AS count
      FROM user_service.profiles
    `;

    const values: Date[] = [];

    // If startDate is provided, add WHERE clause to filter by date
    if (startDate) {
      query += `
        WHERE created_at >= $1
      `;
      values.push(startDate);
    }

    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error("Error in getUsersCount:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Gets the count of posts, optionally filtered by date
 * @param startDate - Optional date to filter posts created on or after this date
 * @returns A promise that resolves to the number of posts
 * @throws Error if the database query fails
 */
export const getPostsCount = async (startDate?: Date): Promise<number> => {
  try {
    let query = `
      SELECT COUNT(*) AS count
      FROM post_service.posts
    `;

    const values: Date[] = [];

    // If startDate is provided, add WHERE clause to filter by date
    if (startDate) {
      query += `
        WHERE created_at >= $1
      `;
      values.push(startDate);
    }

    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error("Error in getPostsCount:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Gets the count of connections, optionally filtered by date
 * @param startDate - Optional date to filter connections created on or after this date
 * @returns A promise that resolves to the number of connections
 * @throws Error if the database query fails
 */
export const getConnectionsCount = async (
  startDate?: Date
): Promise<number> => {
  try {
    let query = `
      SELECT COUNT(*) AS count
      FROM connection_service.connections
    `;

    const values: Date[] = [];

    // If startDate is provided, add WHERE clause to filter by date
    if (startDate) {
      query += `
        WHERE created_at >= $1
      `;
      values.push(startDate);
    }

    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error("Error in getConnectionsCount:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Gets the count of follows, optionally filtered by date
 * @param startDate - Optional date to filter follows created on or after this date
 * @returns A promise that resolves to the number of follows
 * @throws Error if the database query fails
 */
export const getFollowsCount = async (startDate?: Date): Promise<number> => {
  try {
    let query = `
      SELECT COUNT(*) AS count
      FROM connection_service.follows
    `;

    const values: Date[] = [];

    // If startDate is provided, add WHERE clause to filter by date
    if (startDate) {
      query += `
        WHERE created_at >= $1
      `;
      values.push(startDate);
    }

    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error("Error in getFollowsCount:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Retrieves a paginated list of posts that have been reported
 * @param pageNumber - The page number for pagination
 * @returns A promise that resolves to a paginated response containing reported posts
 * @throws Error if the database query fails
 */
export const getReportedPosts = async (
  pageNumber: number
): Promise<PaginatedResponse<Post>> => {
  try {
    // Pagination constants
    const PAGE_SIZE = 20; // Number of results per page
    const OFFSET = (pageNumber - 1) * PAGE_SIZE; // Offset based on page number

    const countQuery = `
      SELECT COUNT(DISTINCT post_id) AS total
      FROM post_service.reports
    `;
    const countResult = await db.query(countQuery);
    const totalRecords = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalRecords / PAGE_SIZE);
    const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
    const previousPage = pageNumber > 1 ? pageNumber - 1 : null;
    const paginationMetadata = {
      totalRecords,
      totalPages,
      currentPage: pageNumber,
      nextPage,
      previousPage,
    };

    const query = `
      SELECT DISTINCT ON (r.post_id) r.post_id
      FROM post_service.reports AS r
      ORDER BY r.post_id DESC
      LIMIT $1 OFFSET $2
    `;
    const values = [PAGE_SIZE, OFFSET];
    const result = await db.query(query, values);

    const reportedPosts = await Promise.all(
      result.rows.map(async (row) => {
        const post = await getPostById(row.post_id);
        return post!;
      })
    );

    return {
      data: reportedPosts,
      pagination: paginationMetadata,
    };
  } catch (error) {
    console.error("Error in getReportedPosts:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Retrieves a paginated list of reports for a specific post
 * @param postId - The ID of the post to get reports for
 * @param pageNumber - The page number for pagination
 * @returns A promise that resolves to a paginated response containing post reports
 * @throws Error if the database query fails
 */
export const getPostReports = async (
  postId: number,
  pageNumber: number
): Promise<PaginatedResponse<PostReport>> => {
  try {
    // Pagination constants
    const PAGE_SIZE = 20; // Number of results per page
    const OFFSET = (pageNumber - 1) * PAGE_SIZE; // Offset based on page number

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM post_service.reports
      WHERE post_id = $1
    `;
    const countValues = [postId];

    const countResult = await db.query(countQuery, countValues);
    const totalRecords = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalRecords / PAGE_SIZE);
    const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
    const previousPage = pageNumber > 1 ? pageNumber - 1 : null;
    const paginationMetadata = {
      totalRecords,
      totalPages,
      currentPage: pageNumber,
      nextPage,
      previousPage,
    };
    const query = `
      SELECT r.*, u.first_name, u.last_name, u.profile_picture_id
      FROM post_service.reports AS r
      JOIN user_service.profiles AS u ON r.reporter_id = u.user_id
      WHERE r.post_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const values = [postId, PAGE_SIZE, OFFSET];
    const result = await db.query(query, values);
    const reportedPosts = await Promise.all(
      result.rows.map(async (row) => {
        // Fetch reporter profile photo URL
        const reporter_profile_picture_url = await getPresignedUrl(
          row.profile_picture_id
        );

        return {
          id: row.id,
          reporter_id: row.reporter_id,
          reporter_full_name: `${row.first_name} ${row.last_name}`,
          reporter_profile_picture: reporter_profile_picture_url,
          reason: row.reason,
          description: row.description,
          status: row.status,
          admin_comment: row.admin_comment,
          created_at: row.created_at,
          updated_at: row.updated_at,
        };
      })
    );
    return {
      data: reportedPosts,
      pagination: paginationMetadata,
    };
  } catch (error) {
    console.error("Error in getPostReports:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Updates the status of a post report and adds an optional admin comment
 * @param reportId - The ID of the report to update
 * @param status - The new status to set
 * @param comment - Optional comment from admin explaining the decision
 * @returns A promise that resolves to a boolean indicating if the update was successful
 * @throws Error if the database query fails
 */
export const updatePostReportStatus = async (
  reportId: number,
  status: string,
  comment: string | null
): Promise<boolean> => {
  try {
    const query = `
      UPDATE post_service.reports
      SET status = $1, admin_comment = $2
      WHERE id = $3
      RETURNING id
    `;
    const values = [status, comment, reportId];
    const result = await db.query(query, values);
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error in updatePostReportStatus:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Deletes a post from the database
 * @param postId - The ID of the post to delete
 * @returns A promise that resolves to a boolean indicating if the deletion was successful
 * @throws Error if the database query fails
 */
export const deletePost = async (postId: number): Promise<boolean> => {
  try {
    const query = `
      DELETE FROM post_service.posts
      WHERE id = $1
      RETURNING id
    `;
    const values = [postId];
    const result = await db.query(query, values);
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error in deletePost:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Gets the count of post reports, optionally filtered by date
 * @param startDate - Optional date to filter reports created on or after this date
 * @returns A promise that resolves to the number of post reports
 * @throws Error if the database query fails
 */
export const getPostReportsCount = async (
  startDate?: Date
): Promise<number> => {
  try {
    let query = `
      SELECT COUNT(*) AS count
      FROM post_service.reports
    `;

    const values: Date[] = [];

    // If startDate is provided, add WHERE clause to filter by date
    if (startDate) {
      query += `
        WHERE created_at >= $1
      `;
      values.push(startDate);
    }

    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error("Error in getPostReportsCount:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Gets the count of subscriptions, optionally filtered by date
 * @param startDate - Optional date to filter subscriptions created on or after this date
 * @returns A promise that resolves to the number of subscriptions
 * @throws Error if the database query fails
 */
export const getSubscriptionsCount = async (
  startDate?: Date
): Promise<number> => {
  try {
    let query = `
      SELECT COUNT(*) AS count
      FROM payment_service.subscription_payment
    `;

    const values: Date[] = [];

    // If startDate is provided, add WHERE clause to filter by date
    if (startDate) {
      query += `
        WHERE first_payment_date >= $1
      `;
      values.push(startDate);
    }

    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error("Error in getSubscriptionsCount:", error);
    throw new Error("Database query failed");
  }
};
