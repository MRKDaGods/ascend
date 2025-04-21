import db from "@shared/config/db";
import { ReportedJob, ReportedPost } from "packages/shared/src/models/report";
import { getPostById } from "@shared/utils/post";

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

export const getReportedJobs = async (
  pageNumber: number
): Promise<PaginatedResponse<ReportedJob>> => {
  try {
    // Pagination constants
    const PAGE_SIZE = 30; // Number of results per page
    const OFFSET = (pageNumber - 1) * PAGE_SIZE; // Offset based on page number

    const countQuery = `
      SELECT COUNT(*) AS total
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
      SELECT r.*, j.*, c.*
      FROM job_service.reports AS r
      JOIN job_service.jobs AS j ON r.job_id = j.job_id
      JOIN company_service.companies AS c ON j.company_id = c.id
      ORDER BY r.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const values = [PAGE_SIZE, OFFSET];
    const result = await db.query(query, values);

    const reportedJobs = result.rows.map((row) => ({
      id: row.id,
      job: {
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
        company_name: row.name,
        company_logo_url: row.logo_url,
        created_at: row.created_at,
      },
      reporter_id: row.reporter_id,
      reason: row.reason,
      status: row.status,
      created_at: row.created_at,
    }));

    return {
      data: reportedJobs,
      pagination: paginationMetadata,
    };
  } catch (error) {
    console.error("Error in getReportedJobs:", error);
    throw new Error("Database query failed");
  }
};

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

export const getReportedPosts = async (
  pageNumber: number
): Promise<PaginatedResponse<ReportedPost>> => {
  try {
    // Pagination constants
    const PAGE_SIZE = 30; // Number of results per page
    const OFFSET = (pageNumber - 1) * PAGE_SIZE; // Offset based on page number

    const countQuery = `
      SELECT COUNT(*) AS total
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
      SELECT r.*
      FROM post_service.reports AS r
      ORDER BY r.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const values = [PAGE_SIZE, OFFSET];
    const result = await db.query(query, values);

    const reportedPosts = await Promise.all(
      result.rows.map(async (row) => {
        const post = await getPostById(row.post_id);
        return {
          id: row.id,
          post: post!,
          reporter_id: row.reporter_id,
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
    console.error("Error in getReportedPosts:", error);
    throw new Error("Database query failed");
  }
};

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
