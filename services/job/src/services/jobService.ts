import db from "@shared/config/db";
import { Job, JobApplication, SavedJob } from "packages/shared/src/models/job";

/**
 * Interface for job search parameters
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
 * Searches for jobs based on provided criteria with pagination
 * @param params - Search parameters including filters and pagination
 * @returns Array of matching jobs or null if none found
 * @throws Error if database query fails
 */
export const searchJobsByCriteria = async ({
  keyword,
  location,
  industry,
  experience_level,
  company_name,
  salary_range_min,
  salary_range_max,
  pageNumber
}: JobSearchParams): Promise<Job[] | null> => {
  try {
    // Pagination constants
    const LIMIT = 30; // Number of results per page
    const OFFSET = (pageNumber - 1) * LIMIT; // Offset based on page number

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
      conditions.push(`(j.title ILIKE $${values.length + 1} OR j.description ILIKE $${values.length + 2})`);
      values.push(`%${keyword}%`, `%${keyword}%`);
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
      query += " AND " + conditions.join(' AND ');
    }

    query += ` ORDER BY j.created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(LIMIT, OFFSET);

    const result = await db.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error("Error searching jobs:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Creates a new job posting in the database
 * @param title - Job title
 * @param description - Job description
 * @param location - Job location
 * @param industry - Industry category
 * @param experience_level - Required experience level
 * @param salary_range_min - Minimum salary
 * @param salary_range_max - Maximum salary
 * @param company_id - Company identifier
 * @param posted_by - User who posted the job
 * @returns Created job object
 * @throws Error if database insertion fails
 */
export const createNewJob = async (
  title: string,
  description: string,
  location: string,
  industry: string,
  experience_level: string,
  salary_range_min: number,
  salary_range_max: number,
  company_id: number,
  posted_by: number
): Promise<Job> => {
  try {
    const query = `
      INSERT INTO job_service.jobs (title, description, location, industry, experience_level, salary_range_min, salary_range_max, company_id, posted_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      title,
      description,
      location,
      industry,
      experience_level,
      salary_range_min,
      salary_range_max,
      company_id,
      posted_by
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating job:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Saves a job to user's saved jobs list
 * @param user_id - User identifier
 * @param job_id - Job identifier
 * @returns Saved job record
 * @throws Error if database insertion fails
 */
export const saveJobForUser = async (user_id: number, job_id: number): Promise<SavedJob> => {
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
 * Removes a job from user's saved jobs list
 * @param user_id - User identifier
 * @param job_id - Job identifier
 * @returns True if deleted, false if not found
 * @throws Error if database query fails
 */
export const removeSavedJobForUser = async (user_id: number, job_id: number): Promise<boolean> => {
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
 * Retrieves all saved jobs for a user
 * @param user_id - User identifier
 * @returns Array of saved jobs or null if none found
 * @throws Error if database query fails
 */
export const fetchUserSavedJobs = async (user_id: number): Promise<Job[] | null> => {
  try {
    const query = `
      SELECT j.*, c.name AS company_name
      FROM job_service.saved_jobs AS s
      JOIN job_service.jobs AS j
      ON s.job_id = j.job_id
      JOIN company_service.companies AS c
      ON j.company_id = c.id
      WHERE s.user_id = $1
    `;
    const values = [user_id];
    const result = await db.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error("Error getting saved jobs:", error);
    throw new Error("Database query failed");
  }
};

/**
 * Submits a job application for a user
 * @param user_id - User identifier
 * @param job_id - Job identifier
 * @returns Job application record or null if job not found
 * @throws Error if database query fails
 */
export const submitJobApplication = async (user_id: number, job_id: number): Promise<JobApplication | null> => {
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
      INSERT INTO job_service.job_applications (user_id, job_id)
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
 * Retrieves the status of a job application
 * @param application_id - Application identifier
 * @param userId - User identifier
 * @returns Job application details or null if not found
 * @throws Error if database query fails
 */
export const fetchApplicationStatus = async (application_id: number, userId: number): Promise<JobApplication | null> => {
  try {
    const query = `
      SELECT * FROM job_service.job_applications
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