import db from "@shared/config/db";
import { Services } from "@ascend/shared";
import { getPresignedUrl } from "@shared/utils/files";
import { getUserFullName } from "@shared/utils/userProfile";

import {
  Events,
  callRPC,
  getRPCQueueName,
  FileUploadPayload,
} from "@shared/rabbitMQ";

import {
  Job,
  SavedJob,
  Application,
  JobApplicationForUser,
} from "packages/shared/src/models/job";

/**
 * Parameters for searching jobs with various filters
 */
interface JobSearchParams {
  /** Optional keyword to search in job title and description */
  keyword?: string;
  /** Optional array of locations to filter jobs */
  location?: string[];
  /** Optional array of industries to filter jobs */
  industry?: string[];
  /** Optional array of experience levels to filter jobs */
  experience_level?: string[];
  /** Optional array of company names to filter jobs */
  company?: string[];
  /** Optional minimum salary range to filter jobs */
  salary_min_range?: number;
  /** Optional maximum salary range to filter jobs */
  salary_max_range?: number;
  /** Current page number for pagination */
  pageNumber: number;
}

/**
 * Generic paginated response structure
 * @template T - The type of data contained in the response
 */
interface PaginatedResponse<T> {
  /** Array of data items */
  data: T[];
  /** Pagination metadata */
  pagination: {
    /** Total number of records across all pages */
    totalRecords: number;
    /** Total number of pages */
    totalPages: number;
    /** Current page number */
    currentPage: number;
    /** Next page number, or null if this is the last page */
    nextPage: number | null;
    /** Previous page number, or null if this is the first page */
    previousPage: number | null;
  };
}

/**
 * Checks if a user is the creator of a specific job
 * @param userId - ID of the user to check
 * @param jobId - ID of the job to check
 * @returns Promise resolving to boolean indicating if the user is the job creator
 * @throws {Error} When database query fails
 */
export const isUserJobCreator = async (
  userId: number,
  jobId: number
): Promise<boolean> => {
  try {
    const query = `
      SELECT COUNT(*) AS count
      FROM job_service.jobs
      WHERE job_id = $1 AND user_id = $2
    `;
    const values = [jobId, userId];
    const result = await db.query(query, values);
    return result.rows[0].count > 0;
  } catch (error) {
    console.error("Error checking if user is job creator:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Gets the job ID associated with a specific application
 * @param applicationId - The ID of the application
 * @returns Promise resolving to the job ID or null if not found
 * @throws {Error} When database query fails
 */
export const getJobIdByApplicationId = async (
  applicationId: number
): Promise<number | null> => {
  try {
    const query = `
      SELECT job_id
      FROM job_service.applications
      WHERE application_id = $1
    `;
    const values = [applicationId];
    const result = await db.query(query, values);
    return result.rows.length > 0 ? result.rows[0].job_id : null;
  } catch (error) {
    console.error("Error getting job ID by application ID:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Checks if a job with the specified ID exists
 * @param jobId - ID of the job to check
 * @returns Promise resolving to boolean indicating if the job exists
 * @throws {Error} When database query fails
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
    return result.rows[0].count > 0;
  } catch (error) {
    console.error("Error checking if job exists:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Checks if a user is the creator of a specific company
 * @param userId - ID of the user to check
 * @param companyId - ID of the company to check
 * @returns Promise resolving to boolean indicating if the user is the company creator
 * @throws {Error} When database query fails
 */
export const isUserCompanyCreator = async (
  userId: number,
  companyId: number
): Promise<boolean> => {
  try {
    const query = `
      SELECT COUNT(*) AS count
      FROM company_service.company
      WHERE company_id = $1 AND created_by = $2
    `;
    const values = [companyId, userId];
    const result = await db.query(query, values);
    return result.rows[0].count > 0;
  } catch (error) {
    console.error("Error checking if user is company creator:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Checks if a user has saved a specific job
 * @param userId - ID of the user
 * @param jobId - ID of the job
 * @returns Promise resolving to boolean indicating if the user has saved the job
 * @throws {Error} When database query fails
 */
export const hasUserSavedJob = async (
  userId: number,
  jobId: number
): Promise<boolean> => {
  try {
    const query = `
      SELECT COUNT(*) AS count
      FROM job_service.saved_jobs
      WHERE user_id = $1 AND job_id = $2
    `;
    const values = [userId, jobId];
    const result = await db.query(query, values);
    return result.rows[0].count > 0;
  } catch (error) {
    console.error("Error checking if user has saved job:", error);
    throw new Error("Database query failed");
  }
};

export const hasUserExceededApplicationLimit = async (
  userId: number
): Promise<boolean> => {
  try {
    const query = `
      SELECT job_applications_per_month, job_applications_limit
      FROM payment_service.usage
      WHERE user_id = $1
    `;
    const values = [userId];
    const result = await db.query(query, values);
    return (
      result.rows[0].job_applications_per_month >=
      result.rows[0].job_applications_limit
    );
  } catch (error) {
    console.error("Error checking if user exceeded application limit:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Checks if a user has applied to a specific job
 * @param userId - ID of the user
 * @param jobId - ID of the job
 * @returns Promise resolving to boolean indicating if the user has applied to the job
 * @throws {Error} When database query fails
 */
export const hasUserAppliedToJob = async (
  userId: number,
  jobId: number
): Promise<boolean> => {
  try {
    const query = `
      SELECT COUNT(*) AS count
      FROM job_service.applications
      WHERE user_id = $1 AND job_id = $2
    `;
    const values = [userId, jobId];
    const result = await db.query(query, values);
    return result.rows[0].count > 0;
  } catch (error) {
    console.error("Error checking if user has applied to job:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Searches for jobs based on provided filters and pagination
 * @param params - Search parameters and filters
 * @param params.keyword - Optional search term for job title and description
 * @param params.location - Optional array of locations to filter by
 * @param params.industry - Optional array of industries to filter by
 * @param params.experience_level - Optional array of experience levels to filter by
 * @param params.company - Optional array of company names to filter by
 * @param params.salary_min_range - Optional minimum salary to filter by
 * @param params.salary_max_range - Optional maximum salary to filter by
 * @param params.pageNumber - Page number for pagination
 * @returns Promise resolving to paginated list of jobs matching the search criteria
 * @throws {Error} When database query fails
 */
export const searchJobs = async ({
  keyword,
  location,
  industry,
  experience_level,
  company,
  salary_min_range,
  salary_max_range,
  pageNumber,
}: JobSearchParams): Promise<PaginatedResponse<Job>> => {
  try {
    // Pagination constants
    const PAGE_SIZE = 20; // Number of results per page
    const OFFSET = (pageNumber - 1) * PAGE_SIZE; // Offset based on page number

    let query = `
      SELECT j.*, c.company_name, c.profile_photo_id
      FROM job_service.jobs AS j
      JOIN company_service.company AS c ON j.company_id = c.company_id
      WHERE 1=1
    `;

    let countQuery = `
      SELECT COUNT(*) AS total
      FROM job_service.jobs AS j
      JOIN company_service.company AS c ON j.company_id = c.company_id
      WHERE 1=1
    `;

    const conditions: string[] = [];
    const values: any[] = [];

    // Add search conditions based on provided parameters
    if (keyword) {
      conditions.push(
        `(j.title ILIKE $${values.length + 1} OR j.description ILIKE $${
          values.length + 1
        })`
      );
      values.push(`%${keyword}%`);
    }

    if (location && location.length > 0) {
      conditions.push(`j.location ILIKE ANY($${values.length + 1}::text[])`);
      const locationSearchTerms = location.map((loc) => `%${loc}%`);
      values.push(locationSearchTerms);
    }

    if (industry && industry.length > 0) {
      conditions.push(`j.industry ILIKE  ANY($${values.length + 1}::text[])`);
      const industrySearchTerms = industry.map((ind) => `%${ind}%`);
      values.push(industrySearchTerms);
    }

    if (experience_level && experience_level.length > 0) {
      conditions.push(
        `j.experience_level ILIKE ANY($${values.length + 1}::text[])`
      );
      values.push(experience_level);
    }

    if (company && company.length > 0) {
      conditions.push(
        `c.company_name ILIKE ANY($${values.length + 1}::text[])`
      );
      const companySearchTerms = company.map((name) => `%${name}%`);
      values.push(companySearchTerms);
    }

    if (salary_min_range) {
      conditions.push(`j.salary_min_range >= $${values.length + 1}`);
      values.push(salary_min_range);
    }

    if (salary_max_range) {
      conditions.push(`j.salary_max_range <= $${values.length + 1}`);
      values.push(salary_max_range);
    }

    if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
      countQuery += " AND " + conditions.join(" AND ");
    }

    // Execute count query to get total records
    const countResult = await db.query(countQuery, values);

    // Add pagination parameters to the query
    query += ` ORDER BY j.created_at DESC LIMIT $${values.length + 1} OFFSET $${
      values.length + 2
    }`;
    values.push(PAGE_SIZE, OFFSET);

    // Execute the paginated query
    const result = await db.query(query, values);

    const jobsList = await Promise.all(
      result.rows.map(async (row) => {
        // Fetch company logo URL
        const company_logo_url = await getPresignedUrl(row.profile_photo_id);

        const job = {
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

        return job;
      })
    );

    // Calculate pagination metadata
    const totalRecords = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalRecords / PAGE_SIZE);
    const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
    const previousPage = pageNumber > 1 ? pageNumber - 1 : null;

    const paginationData = {
      totalRecords,
      totalPages,
      currentPage: pageNumber,
      nextPage,
      previousPage,
    };

    return {
      data: jobsList,
      pagination: paginationData,
    };
  } catch (error) {
    console.error("Error searching jobs:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Retrieves jobs associated with a specific company
 * @param companyId - ID of the company
 * @param pageNumber - Page number for pagination
 * @returns Promise resolving to paginated list of jobs for the company
 * @throws {Error} When database query fails
 */
export const getJobsByCompanyId = async (
  companyId: number,
  pageNumber: number
): Promise<PaginatedResponse<Job>> => {
  try {
    // Pagination constants
    const PAGE_SIZE = 20; // Number of results per page
    const OFFSET = (pageNumber - 1) * PAGE_SIZE; // Offset based on page number

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM job_service.jobs
      WHERE company_id = $1
    `;
    const countValues = [companyId];

    // Execute the count query
    const countResult = await db.query(countQuery, countValues);

    const query = `
      SELECT j.*, c.company_name, c.profile_photo_id
      FROM job_service.jobs AS j
      JOIN company_service.company AS c ON j.company_id = c.company_id
      WHERE j.company_id = $1
      ORDER BY j.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const values = [companyId, PAGE_SIZE, OFFSET];

    // Execute the paginated query
    const result = await db.query(query, values);

    const jobsList = await Promise.all(
      result.rows.map(async (row) => {
        // Fetch company logo URL
        const company_logo_url = await getPresignedUrl(row.profile_photo_id);

        const job = {
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

        return job;
      })
    );

    // Calculate pagination metadata
    const totalRecords = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalRecords / PAGE_SIZE);
    const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
    const previousPage = pageNumber > 1 ? pageNumber - 1 : null;

    const paginationData = {
      totalRecords,
      totalPages,
      currentPage: pageNumber,
      nextPage,
      previousPage,
    };

    return {
      data: jobsList,
      pagination: paginationData,
    };
  } catch (error) {
    console.error("Error getting jobs by company ID:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Creates a new job listing
 * @param title - Title of the job
 * @param description - Detailed job description
 * @param industry - Industry category of the job
 * @param type - Type of job (e.g., full-time, part-time)
 * @param experience_level - Experience level required
 * @param location - Job location
 * @param workplace_type - Workplace type (e.g., remote, on-site)
 * @param salary_min_range - Minimum salary range (can be null)
 * @param salary_max_range - Maximum salary range (can be null)
 * @param company_id - ID of the company creating the job
 * @param userId - ID of the user creating the job
 * @returns Promise resolving to the created job
 * @throws {Error} When database query fails
 */
export const createJob = async (
  title: string,
  description: string,
  industry: string,
  type: string,
  experience_level: string,
  location: string,
  workplace_type: string,
  salary_min_range: number | null,
  salary_max_range: number | null,
  company_id: number,
  userId: number
): Promise<Job> => {
  try {
    const query = `
      INSERT INTO job_service.jobs (
        title,
        description,
        industry,
        type,
        experience_level,
        location,
        workplace_type,
        salary_min_range,
        salary_max_range,
        company_id,
        user_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      title,
      description,
      industry,
      type,
      experience_level,
      location,
      workplace_type,
      salary_min_range,
      salary_max_range,
      company_id,
      userId,
    ];

    // Execute the query to insert the new job
    const result = await db.query(query, values);

    // Return the created job
    return result.rows[0];
  } catch (error) {
    console.error("Error creating job:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Updates an existing job listing
 * @param jobId - ID of the job to update
 * @param title - Optional new title for the job
 * @param description - Optional new description for the job
 * @param industry - Optional new industry for the job
 * @param type - Optional new job type
 * @param experience_level - Optional new experience level
 * @param location - Optional new job location
 * @param workplace_type - Optional new workplace type
 * @param salary_min_range - Optional new minimum salary range
 * @param salary_max_range - Optional new maximum salary range
 * @returns Promise resolving to the updated job
 * @throws {Error} When database query fails or if salary ranges are invalid
 */
export const updateJob = async (
  jobId: number,
  title?: string,
  description?: string,
  industry?: string,
  type?: string,
  experience_level?: string,
  location?: string,
  workplace_type?: string,
  salary_min_range?: number,
  salary_max_range?: number
): Promise<Job> => {
  try {
    // If only one salary range is provided, fetch the existing job to validate against the other range
    if (
      (salary_min_range !== undefined && salary_max_range === undefined) ||
      (salary_min_range === undefined && salary_max_range !== undefined)
    ) {
      const existingJobQuery = `SELECT salary_min_range, salary_max_range FROM job_service.jobs WHERE job_id = $1`;
      const existingJobResult = await db.query(existingJobQuery, [jobId]);

      const existingJob = existingJobResult.rows[0];

      // get the effective min and max range (if one of them is not provided, use the existing one)
      const effectiveMinRange =
        salary_min_range !== undefined
          ? salary_min_range
          : existingJob.salary_min_range;
      const effectiveMaxRange =
        salary_max_range !== undefined
          ? salary_max_range
          : existingJob.salary_max_range;

      // Only validate if both ranges exist (not null)
      if (
        effectiveMinRange !== null &&
        effectiveMaxRange !== null &&
        effectiveMinRange > effectiveMaxRange
      ) {
        throw new Error(
          "Salary minimum range must be less than or equal to salary maximum range"
        );
      }
    }

    const query = `
      UPDATE job_service.jobs
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          industry = COALESCE($3, industry),
          type = COALESCE($4, type),
          experience_level = COALESCE($5, experience_level),
          location = COALESCE($6, location),
          workplace_type = COALESCE($7, workplace_type),
          salary_min_range = COALESCE($8, salary_min_range),
          salary_max_range = COALESCE($9, salary_max_range)
      WHERE job_id = $10
      RETURNING *
    `;

    const values = [
      title,
      description,
      industry,
      type,
      experience_level,
      location,
      workplace_type,
      salary_min_range,
      salary_max_range,
      jobId,
    ];

    // Execute the query to update the job
    const result = await db.query(query, values);

    // Return the updated job
    return result.rows[0];
  } catch (error) {
    console.error("Error updating job:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Deletes a job listing
 * @param jobId - ID of the job to delete
 * @returns Promise resolving when the job is deleted
 * @throws {Error} When database query fails
 */
export const deleteJob = async (jobId: number): Promise<void> => {
  try {
    const query = `
      DELETE FROM job_service.jobs
      WHERE job_id = $1
    `;
    const values = [jobId];
    await db.query(query, values);
  } catch (error) {
    console.error("Error deleting job:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Saves a job for a user
 * @param userId - ID of the user saving the job
 * @param jobId - ID of the job to save
 * @returns Promise resolving to the saved job record
 * @throws {Error} When database query fails
 */
export const saveJob = async (
  userId: number,
  jobId: number
): Promise<SavedJob> => {
  try {
    const query = `
      INSERT INTO job_service.saved_jobs (user_id, job_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [userId, jobId];
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error saving job:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Removes a saved job for a user
 * @param userId - ID of the user
 * @param jobId - ID of the job to remove from saved list
 * @returns Promise resolving when the job is removed from saved list
 * @throws {Error} When database query fails
 */
export const removeSavedJob = async (
  userId: number,
  jobId: number
): Promise<void> => {
  try {
    const query = `
      DELETE FROM job_service.saved_jobs
      WHERE user_id = $1 AND job_id = $2
      RETURNING *
    `;
    const values = [userId, jobId];
    await db.query(query, values);
  } catch (error) {
    console.error("Error deleting saved job:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Gets all jobs saved by a user
 * @param userId - ID of the user
 * @param pageNumber - Page number for pagination
 * @returns Promise resolving to paginated list of jobs saved by the user
 * @throws {Error} When database query fails
 */
export const getSavedJobs = async (
  userId: number,
  pageNumber: number
): Promise<PaginatedResponse<SavedJob>> => {
  try {
    // Pagination constants
    const PAGE_SIZE = 20; // Number of results per page
    const OFFSET = (pageNumber - 1) * PAGE_SIZE; // Offset based on page number

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM job_service.saved_jobs
      WHERE user_id = $1
    `;
    const countValues = [userId];

    // Execute the count query
    const countResult = await db.query(countQuery, countValues);

    const query = `
      SELECT s.saved_at, j.*, c.company_name, c.profile_photo_id
      FROM job_service.saved_jobs AS s
      JOIN job_service.jobs AS j ON s.job_id = j.job_id
      JOIN company_service.company AS c ON j.company_id = c.company_id
      WHERE s.user_id = $1
      ORDER BY s.saved_at DESC
      LIMIT $2 OFFSET $3
    `;
    const values = [userId, PAGE_SIZE, OFFSET];

    // Execute the paginated query
    const result = await db.query(query, values);

    const savedJobsList = await Promise.all(
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
          saved_at: row.saved_at,
        };
      })
    );

    // Calculate pagination metadata
    const totalRecords = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalRecords / PAGE_SIZE);
    const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
    const previousPage = pageNumber > 1 ? pageNumber - 1 : null;

    const paginationData = {
      totalRecords,
      totalPages,
      currentPage: pageNumber,
      nextPage,
      previousPage,
    };

    return {
      data: savedJobsList,
      pagination: paginationData,
    };
  } catch (error) {
    console.error("Error getting saved jobs:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Submits a job application
 * @param userId - ID of the user applying for the job
 * @param jobId - ID of the job being applied to
 * @param resume - Resume file upload
 * @param email - Contact email for the application
 * @param phone - Contact phone number for the application
 * @returns Promise resolving to the created application
 * @throws {Error} When database query or file upload fails
 */
export const submitJobApplication = async (
  userId: number,
  jobId: number,
  resume: Express.Multer.File,
  email: string,
  phone: string
): Promise<Application> => {
  try {
    // Set up the RPC queue for file upload
    const fileRpcQueue = getRPCQueueName(Services.FILE, Events.FILE_UPLOAD_RPC);

    // Create the payload for file upload
    const payload: FileUploadPayload.Request = {
      user_id: userId,
      file_buffer: resume.buffer.toString("base64"),
      file_name: resume.originalname,
      mime_type: resume.mimetype,
      file_size: resume.size,
      context: "job_application",
    };

    // Call the RPC to upload the file
    const fileResponse = await callRPC<FileUploadPayload.Response>(
      fileRpcQueue,
      payload,
      60000
    );

    const resumeId = fileResponse.file_id;
    const resumeUrl = await getPresignedUrl(resumeId);

    const query = `
      INSERT INTO job_service.applications (user_id, job_id, resume_id, email, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [userId, jobId, resumeId, email, phone];

    // Execute the query to insert the new application
    const result = await db.query(query, values);

    // Increment the job application count for the user
    const updateQuery = `
      UPDATE payment_service.usage
      SET job_applications_per_month = job_applications_per_month + 1
      WHERE user_id = $1
    `;
    const updateValues = [userId];
    await db.query(updateQuery, updateValues);

    // Return the created application
    return {
      application_id: result.rows[0].application_id,
      user_id: result.rows[0].user_id,
      job_id: result.rows[0].job_id,
      resume_url: resumeUrl!,
      email: result.rows[0].email,
      phone: result.rows[0].phone,
      status: result.rows[0].status,
      applied_at: result.rows[0].applied_at,
    };
  } catch (error) {
    console.error("Error applying for job:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Gets all job applications for a specific user
 * @param userId - ID of the user
 * @param pageNumber - Page number for pagination
 * @returns Promise resolving to paginated list of job applications for the user
 * @throws {Error} When database query fails
 */
export const getJobApplicationsByUserId = async (
  userId: number,
  pageNumber: number
): Promise<PaginatedResponse<JobApplicationForUser>> => {
  try {
    // Pagination constants
    const PAGE_SIZE = 20; // Number of results per page
    const OFFSET = (pageNumber - 1) * PAGE_SIZE; // Offset based on page number

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM job_service.applications
      WHERE user_id = $1
    `;
    const countValues = [userId];

    // Execute the count query
    const countResult = await db.query(countQuery, countValues);

    const query = `
      SELECT a.*, j.*, c.company_name, c.profile_photo_id
      FROM job_service.applications AS a
      JOIN job_service.jobs AS j ON a.job_id = j.job_id
      JOIN company_service.company AS c ON j.company_id = c.company_id
      WHERE a.user_id = $1
      ORDER BY a.applied_at DESC
      LIMIT $2 OFFSET $3
    `;
    const values = [userId, PAGE_SIZE, OFFSET];

    // Execute the paginated query
    const result = await db.query(query, values);

    const applicationsList = await Promise.all(
      result.rows.map(async (row) => {
        // Fetch company logo URL
        const company_logo_url = await getPresignedUrl(row.profile_photo_id);

        // Fetch resume URL
        const resume_url = await getPresignedUrl(row.resume_id);

        return {
          application_id: row.application_id,
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
            company_name: row.company_name,
            company_logo_url,
            created_at: row.created_at,
          },
          resume_url: resume_url!,
          email: row.email,
          phone: row.phone,
          status: row.status,
          applied_at: row.applied_at,
        };
      })
    );

    // Calculate pagination metadata
    const totalRecords = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalRecords / PAGE_SIZE);
    const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
    const previousPage = pageNumber > 1 ? pageNumber - 1 : null;

    const paginationData = {
      totalRecords,
      totalPages,
      currentPage: pageNumber,
      nextPage,
      previousPage,
    };

    return {
      data: applicationsList,
      pagination: paginationData,
    };
  } catch (error) {
    console.error("Error getting job applications by user ID:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Gets the status of a specific job application
 * @param applicationId - ID of the application
 * @param userId - ID of the user to validate ownership
 * @returns Promise resolving to application status or null if not found
 * @throws {Error} When database query fails
 */
export const getApplicationStatus = async (
  applicationId: number,
  userId: number
): Promise<string | null> => {
  try {
    const query = `
      SELECT status FROM job_service.applications
      WHERE application_id = $1 AND user_id = $2
    `;
    const values = [applicationId, userId];
    const result = await db.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error getting application status:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Updates the status of a job application
 * @param applicationId - ID of the application to update
 * @param status - New status for the application
 * @returns Promise resolving when the status is updated
 * @throws {Error} When database query fails
 */
export const updateApplicationStatus = async (
  applicationId: number,
  status: string
): Promise<void> => {
  try {
    const query = `
      UPDATE job_service.applications a
      SET status = $1
      WHERE a.application_id = $2
    `;
    const values = [status, applicationId];
    await db.query(query, values);
  } catch (error) {
    console.error("Error updating application status:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Gets all applications for a specific job
 * @param jobId - ID of the job
 * @param pageNumber - Page number for pagination
 * @returns Promise resolving to paginated list of applications for the job with user names
 * @throws {Error} When database query fails
 */
export const getJobApplications = async (
  jobId: number,
  pageNumber: number
): Promise<PaginatedResponse<Application & { user_full_name: string }>> => {
  try {
    // Pagination constants
    const PAGE_SIZE = 20; // Number of results per page
    const OFFSET = (pageNumber - 1) * PAGE_SIZE; // Offset based on page number

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM job_service.applications
      WHERE job_id = $1
    `;
    const countValues = [jobId];

    // Execute the count query
    const countResult = await db.query(countQuery, countValues);

    const query = `
      SELECT a.*
      FROM job_service.applications AS a
      WHERE a.job_id = $1
      ORDER BY a.applied_at DESC
      LIMIT $2 OFFSET $3
    `;
    const values = [jobId, PAGE_SIZE, OFFSET];

    // Execute the paginated query
    const result = await db.query(query, values);

    const applicationsList = await Promise.all(
      result.rows.map(async (row) => {
        // Fetch user full name
        const user_full_name = await getUserFullName(row.user_id);

        // Fetch resume URL
        const resume_url = await getPresignedUrl(row.resume_id);

        return {
          application_id: row.application_id,
          job_id: row.job_id,
          user_id: row.user_id,
          user_full_name,
          resume_url: resume_url!,
          email: row.email,
          phone: row.phone,
          status: row.status,
          applied_at: row.applied_at,
        };
      })
    );

    // Calculate pagination metadata
    const totalRecords = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalRecords / PAGE_SIZE);
    const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
    const previousPage = pageNumber > 1 ? pageNumber - 1 : null;

    const paginationData = {
      totalRecords,
      totalPages,
      currentPage: pageNumber,
      nextPage,
      previousPage,
    };

    return {
      data: applicationsList,
      pagination: paginationData,
    };
  } catch (error) {
    console.error("Error getting job applications:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Reports a job listing for inappropriate content or other issues
 * @param userId - ID of the user making the report
 * @param jobId - ID of the job being reported
 * @param reason - Reason for reporting the job
 * @returns Promise resolving to boolean indicating if report was successful
 * @throws {Error} When database query fails
 */
export const reportJob = async (
  userId: number,
  jobId: number,
  reason: string
): Promise<boolean> => {
  try {
    // check if the user reported the job before
    const checkQuery = `
      SELECT * FROM job_service.reports
      WHERE reporter_id = $1 AND job_id = $2
    `;
    const checkValues = [userId, jobId];

    // Execute the check query
    const checkResult = await db.query(checkQuery, checkValues);

    // If the user has already reported the job, return false
    if (checkResult.rows.length > 0) {
      return false; // User has already reported this job
    }

    const query = `
      INSERT INTO job_service.reports (reporter_id, job_id, reason)
      VALUES ($1, $2, $3)
      returning *
    `;
    const values = [userId, jobId, reason];

    // Execute the query to insert the new report
    const result = await db.query(query, values);

    // Return true if the report was successful
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error reporting job:", error);
    throw new Error("Database query failed");
  }
};
