import db from "@shared/config/db";
import { Job, Application, SavedJob } from "packages/shared/src/models/job";

/**
 * Interface for job search parameters.
 * @typedef {Object} JobSearchParams
 * @property {string} [keyword] - Keyword to search in title or description.
 * @property {string} [location] - Job location filter.
 * @property {string} [industry] - Job industry filter.
 * @property {string} [experience_level] - Experience level filter.
 * @property {string} [company_name] - Company name filter.
 * @property {number} [salary_range_min] - Minimum salary filter.
 * @property {number} [salary_range_max] - Maximum salary filter.
 * @property {number} pageNumber - Page number for pagination.
 */
interface JobSearchParams {
  keyword?: string;
  location?: string;
  industry?: string;
  experience_level?: string;
  company_name?: string;
  salary_range_min?: number;
  salary_range_max?: number;
  pageNumber: number;
}

/**
 * Interface for paginated response.
 * @typedef {Object} PaginatedResponse
 * @template T
 * @property {T[]} data - Array of data items.
 * @property {Object} pagination - Pagination metadata.
 * @property {number} pagination.totalRecords - Total number of records.
 * @property {number} pagination.totalPages - Total number of pages.
 * @property {number} pagination.currentPage - Current page number.
 * @property {number|null} pagination.nextPage - Next page number or null.
 * @property {number|null} pagination.previousPage - Previous page number or null.
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
 * Retrieves a job by its ID.
 * @param {number} jobId - The ID of the job to retrieve.
 * @returns {Promise<Job|null>} The job object or null if not found.
 * @throws {Error} If the database query fails.
 */
export const getJob = async (jobId: number): Promise<Job | null> => {
  try {
    const query = `
      SELECT *
      FROM job_service.jobs
      WHERE job_id = $1
    `;
    const values = [jobId];
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error getting job:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Searches for jobs based on provided criteria with pagination.
 * @param {JobSearchParams} params - Search parameters and pagination.
 * @returns {Promise<PaginatedResponse<Job>>} Paginated list of matching jobs.
 * @throws {Error} If the database query fails.
 */
export const searchJobs = async ({
  keyword,
  location,
  industry,
  experience_level,
  company_name,
  salary_range_min,
  salary_range_max,
  pageNumber,
}: JobSearchParams): Promise<PaginatedResponse<Job>> => {
  try {
    // Pagination constants
    const PAGE_SIZE = 30; // Number of results per page
    const OFFSET = (pageNumber - 1) * PAGE_SIZE; // Offset based on page number

    let query = `
      SELECT j.*, c.name AS company_name
      FROM job_service.jobs AS j
      JOIN company_service.companies AS c
      ON j.company_id = c.id
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

    if (location) {
      conditions.push(`j.location ILIKE $${values.length + 1}`);
      values.push(`%${location}%`);
    }

    if (industry) {
      conditions.push(`j.industry ILIKE $${values.length + 1}`);
      values.push(`%${industry}%`);
    }

    if (experience_level) {
      conditions.push(`j.experience_level = $${values.length + 1}`);
      values.push(experience_level);
    }

    if (company_name) {
      conditions.push(`c.name ILIKE $${values.length + 1}`);
      values.push(`%${company_name}%`);
    }

    if (salary_range_min) {
      conditions.push(`j.salary_range_min >= $${values.length + 1}`);
      values.push(salary_range_min);
    }

    if (salary_range_max) {
      conditions.push(`j.salary_range_max <= $${values.length + 1}`);
      values.push(salary_range_max);
    }

    if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
    }

    query += ` ORDER BY j.created_at DESC LIMIT $${values.length + 1} OFFSET $${
      values.length + 2
    }`;
    values.push(PAGE_SIZE, OFFSET);

    const result = await db.query(query, values);
    const jobsList = result.rows.map((row) => ({
      ...row,
    }));

    return {
      data: jobsList,
      pagination: {
        totalRecords: result.rows.length,
        currentPage: pageNumber,
        totalPages: Math.ceil(result.rows.length / PAGE_SIZE),
        nextPage:
          result.rows.length > pageNumber * PAGE_SIZE ? pageNumber + 1 : null,
        previousPage: pageNumber > 1 ? pageNumber - 1 : null,
      },
    };
  } catch (error) {
    console.error("Error searching jobs:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Creates a new job posting in the database.
 * @param {string} title - Job title.
 * @param {string} description - Job description.
 * @param {string} industry - Job industry.
 * @param {string} type - Job type (e.g., full-time, part-time).
 * @param {string} experience_level - Required experience level.
 * @param {string} location - Job location.
 * @param {string} workplace_type - Workplace type (e.g., remote, onsite).
 * @param {number|null} salary_min_range - Minimum salary range or null.
 * @param {number|null} salary_max_range - Maximum salary range or null.
 * @param {number} company_id - ID of the company posting the job.
 * @param {number} user_id - ID of the user creating the job.
 * @returns {Promise<Job>} The created job object.
 * @throws {Error} If the database query fails.
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
  user_id: number
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
      user_id,
    ];
    console.log("Creating job with values:", values);
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating job:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Saves a job to a user's saved jobs list.
 * @param {number} user_id - User identifier.
 * @param {number} job_id - Job identifier.
 * @returns {Promise<SavedJob>} The saved job record.
 * @throws {Error} If the database insertion fails.
 */
export const saveJob = async (
  user_id: number,
  job_id: number
): Promise<SavedJob> => {
  try {
    const query = `
      INSERT INTO job_service.saved_jobs (user_id, job_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [user_id, job_id];
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error saving job:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Removes a job from a user's saved jobs list.
 * @param {number} user_id - User identifier.
 * @param {number} job_id - Job identifier.
 * @returns {Promise<boolean>} True if deleted, false if not found.
 * @throws {Error} If the database query fails.
 */
export const removeSavedJob = async (
  user_id: number,
  job_id: number
): Promise<boolean> => {
  try {
    // Check if job is saved before deleting
    const checkQuery = `
      SELECT * FROM job_service.saved_jobs
      WHERE user_id = $1 AND job_id = $2
    `;
    const checkValues = [user_id, job_id];
    const checkResult = await db.query(checkQuery, checkValues);

    if (checkResult.rows.length === 0) {
      return false;
    }

    const query = `
      DELETE FROM job_service.saved_jobs
      WHERE user_id = $1 AND job_id = $2
    `;
    const values = [user_id, job_id];
    await db.query(query, values);
    return true;
  } catch (error) {
    console.error("Error deleting saved job:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Retrieves all saved jobs for a user with pagination.
 * @param {number} user_id - User identifier.
 * @param {number} pageNumber - Page number for pagination.
 * @returns {Promise<PaginatedResponse<SavedJob>>} Paginated list of saved jobs.
 * @throws {Error} If the database query fails.
 */
export const getSavedJobs = async (
  user_id: number,
  pageNumber: number
): Promise<PaginatedResponse<SavedJob>> => {
  try {
    // Pagination constants
    const PAGE_SIZE = 30; // Number of results per page
    const OFFSET = (pageNumber - 1) * PAGE_SIZE; // Offset based on page number

    const query = `
      SELECT job_id, saved_at
      FROM job_service.saved_jobs
      WHERE user_id = $1
      ORDER BY saved_at DESC
      LIMIT $2 OFFSET $3
    `;
    const values = [user_id, PAGE_SIZE, OFFSET];
    const result = await db.query(query, values);

    const savedJobsList = result.rows.map((row) => ({
      ...row,
    }));

    return {
      data: savedJobsList,
      pagination: {
        totalRecords: result.rows.length,
        currentPage: pageNumber,
        totalPages: Math.ceil(result.rows.length / PAGE_SIZE),
        nextPage:
          result.rows.length > pageNumber * PAGE_SIZE ? pageNumber + 1 : null,
        previousPage: pageNumber > 1 ? pageNumber - 1 : null,
      },
    };
  } catch (error) {
    console.error("Error getting saved jobs:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Submits a job application for a user.
 * @param {number} user_id - User identifier.
 * @param {number} job_id - Job identifier.
 * @returns {Promise<Application|null>} The job application record or null if job not found.
 * @throws {Error} If the database query fails.
 */
export const submitJobApplication = async (
  user_id: number,
  job_id: number
): Promise<Application | null> => {
  try {
    // Check if job exists before applying
    const checkQuery = `
      SELECT * FROM job_service.jobs
      WHERE job_id = $1
    `;
    const checkValues = [job_id];
    const checkResult = await db.query(checkQuery, checkValues);

    if (checkResult.rows.length === 0) {
      return null;
    }

    const query = `
      INSERT INTO job_service.applications (user_id, job_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [user_id, job_id];
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error applying for job:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Retrieves the status of a job application.
 * @param {number} application_id - Application identifier.
 * @param {number} userId - User identifier.
 * @returns {Promise<Application|null>} The job application details or null if not found.
 * @throws {Error} If the database query fails.
 */
export const getApplicationStatus = async (
  application_id: number,
  userId: number
): Promise<Application | null> => {
  try {
    const query = `
      SELECT * FROM job_service.applications
      WHERE application_id = $1 AND user_id = $2
    `;
    const values = [application_id, userId];
    const result = await db.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error getting application status:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Updates the status of a job application.
 * @param {number} application_id - Application identifier.
 * @param {number} userId - User identifier.
 * @param {string} status - New status value (e.g., "Pending", "Accepted").
 * @returns {Promise<Application|null>} The updated application or null if not found.
 * @throws {Error} If the database query fails.
 */
export const updateApplicationStatus = async (
  application_id: number,
  userId: number,
  status: string
): Promise<Application | null> => {
  try {
    const query = `
      UPDATE job_service.applications a
      SET status = $1
      FROM job_service.jobs j
      WHERE a.application_id = $2
      AND a.user_id = $3
      AND j.job_id = a.job_id
      AND j.user_id = $3
      RETURNING a.*
    `;
    const values = [status, application_id, userId];
    const result = await db.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error updating application status:", error);
    throw new Error("Database query failed");
  }
};
