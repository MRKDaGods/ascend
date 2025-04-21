import db from "@shared/config/db";
import { Services } from "@ascend/shared";
import { Job, Application, SavedJob } from "packages/shared/src/models/job";
import { getUserFullName } from "@shared/utils/userProfile";
import { getPresignedUrl } from "@shared/utils/files";
import {
  callRPC,
  Events,
  FileUploadPayload,
  getRPCQueueName,
} from "@shared/rabbitMQ";

interface JobSearchParams {
  keyword?: string;
  location?: string[];
  industry?: string[];
  experience_level?: string[];
  company?: string[];
  salary_range_min?: number;
  salary_range_max?: number;
  pageNumber: number;
}

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

export const searchJobs = async ({
  keyword,
  location,
  industry,
  experience_level,
  company,
  salary_range_min,
  salary_range_max,
  pageNumber,
}: JobSearchParams): Promise<PaginatedResponse<Job>> => {
  try {
    // Pagination constants
    const PAGE_SIZE = 30; // Number of results per page
    const OFFSET = (pageNumber - 1) * PAGE_SIZE; // Offset based on page number

    let query = `
      SELECT j.*
      FROM job_service.jobs AS j
      WHERE 1=1
    `;

    let countQuery = `
      SELECT COUNT(*) AS total
      FROM job_service.jobs AS j
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
      conditions.push(`j.location = ANY($${values.length + 1}::text[])`);
      values.push(location);
    }

    if (industry && industry.length > 0) {
      conditions.push(`j.industry = ANY($${values.length + 1}::text[])`);
      values.push(industry);
    }

    if (experience_level && experience_level.length > 0) {
      conditions.push(
        `j.experience_level = ANY($${values.length + 1}::text[])`
      );
      values.push(experience_level);
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
      countQuery += " AND " + conditions.join(" AND ");
    }

    // Execute count query to get total records
    const countResult = await db.query(countQuery, values);
    const totalRecords = parseInt(countResult.rows[0].total);

    // Add pagination to main query
    query += ` ORDER BY j.created_at DESC LIMIT $${values.length + 1} OFFSET $${
      values.length + 2
    }`;
    values.push(PAGE_SIZE, OFFSET);

    // Execute main query
    const result = await db.query(query, values);

    /////////////////////////////////////////////////////////
    // WILL BE CHANGED
    /////////////////////////////////////////////////////////
    const companies = await db.query(
      `
      SELECT *
      FROM company_service.companies
      WHERE 1=1
      ${company ? `AND name ILIKE $1` : ""}
    `,
      company ? [`%${company}%`] : []
    );

    // If company names are provided, filter jobs by company
    if (company && companies.rows.length > 0) {
      const companyIds = companies.rows.map((c) => c.id);
      result.rows = result.rows.filter((job) =>
        companyIds.includes(job.company_id)
      );
    }
    /////////////////////////////////////////////////////////

    const jobsList = await Promise.all(
      result.rows.map(async (row) => {
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
          company_name: "",
          company_logo_url: null,
          created_at: row.created_at,
        };

        // Fetch company details
        const companyQuery = `
          SELECT name
          FROM company_service.companies
          WHERE id = $1
        `;
        const companyValues = [job.company_id];
        const companyResult = await db.query(companyQuery, companyValues);
        job.company_name = companyResult.rows[0].name;

        return job;
      })
    );

    // Calculate pagination metadata
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

export const getSavedJobs = async (
  user_id: number,
  pageNumber: number
): Promise<PaginatedResponse<SavedJob>> => {
  try {
    // Pagination constants
    const PAGE_SIZE = 30; // Number of results per page
    const OFFSET = (pageNumber - 1) * PAGE_SIZE; // Offset based on page number

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM job_service.saved_jobs
      WHERE user_id = $1
    `;
    const countValues = [user_id];
    const countResult = await db.query(countQuery, countValues);
    const totalRecords = parseInt(countResult.rows[0].total);

    const query = `
      SELECT s.saved_at, j.*
      FROM job_service.saved_jobs AS s
      JOIN job_service.jobs AS j ON s.job_id = j.job_id
      WHERE s.user_id = $1
      ORDER BY s.saved_at DESC
      LIMIT $2 OFFSET $3
    `;
    const values = [user_id, PAGE_SIZE, OFFSET];
    const result = await db.query(query, values);

    const savedJobsList = await Promise.all(
      result.rows.map(async (row) => {
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
          company_name: "",
          company_logo_url: null,
          saved_at: row.saved_at,
        };

        const companyQuery = `
          SELECT name, logo_url
          FROM company_service.companies
          WHERE id = $1
        `;
        const companyValues = [job.company_id];
        const companyResult = await db.query(companyQuery, companyValues);
        job.company_name = companyResult.rows[0]?.name || "Unknown Company";

        return job;
      })
    );

    // Calculate pagination metadata
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

export const submitJobApplication = async (
  user_id: number,
  job_id: number,
  resume: Express.Multer.File,
  email: string,
  phone: string
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

    const fileRpcQueue = getRPCQueueName(Services.FILE, Events.FILE_UPLOAD_RPC);

    const payload: FileUploadPayload.Request = {
      user_id,
      file_buffer: resume.buffer.toString("base64"),
      file_name: resume.originalname,
      mime_type: resume.mimetype,
      file_size: resume.size,
      context: "job_application",
    };

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
    const values = [user_id, job_id, resumeId, email, phone];
    const result = await db.query(query, values);

    const jobApplication = {
      application_id: result.rows[0].application_id,
      user_id: result.rows[0].user_id,
      job_id: result.rows[0].job_id,
      resume_url: resumeUrl!,
      email: result.rows[0].email,
      phone: result.rows[0].phone,
      status: result.rows[0].status,
      applied_at: result.rows[0].applied_at,
    };

    return jobApplication;
  } catch (error) {
    console.error("Error applying for job:", error);
    throw new Error("Database query failed");
  }
};

export const getApplicationStatus = async (
  application_id: number,
  userId: number
): Promise<string | null> => {
  try {
    const query = `
      SELECT status FROM job_service.applications
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

export const updateApplicationStatus = async (
  application_id: number,
  status: string
): Promise<boolean> => {
  try {
    const query = `
      UPDATE job_service.applications a
      SET status = $1
      WHERE a.application_id = $2
      RETURNING a.*
    `;
    const values = [status, application_id];
    const result = await db.query(query, values);
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error updating application status:", error);
    throw new Error("Database query failed");
  }
};

export const getJobApplications = async (
  job_id: number,
  pageNumber: number
): Promise<PaginatedResponse<Application & { userFullName: string }>> => {
  try {
    // Pagination constants
    const PAGE_SIZE = 30; // Number of results per page
    const OFFSET = (pageNumber - 1) * PAGE_SIZE; // Offset based on page number

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM job_service.applications
      WHERE job_id = $1
    `;
    const countValues = [job_id];
    const countResult = await db.query(countQuery, countValues);
    const totalRecords = parseInt(countResult.rows[0].total);

    const query = `
      SELECT a.*
      FROM job_service.applications AS a
      WHERE a.job_id = $1
      ORDER BY a.applied_at DESC
      LIMIT $2 OFFSET $3
    `;
    const values = [job_id, PAGE_SIZE, OFFSET];
    const result = await db.query(query, values);

    const applicationsList = await Promise.all(
      result.rows.map(async (row) => {
        const application = {
          application_id: row.application_id,
          job_id: row.job_id,
          user_id: row.user_id,
          userFullName: "",
          resume_url: row.resume_id,
          email: row.email,
          phone: row.phone,
          status: row.status,
          applied_at: row.applied_at,
        };

        application.userFullName = await getUserFullName(application.user_id);
        application.resume_url = await getPresignedUrl(application.resume_url);

        return application;
      })
    );

    // Calculate pagination metadata
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

export const reportJob = async (
  user_id: number,
  job_id: number,
  reason: string
): Promise<boolean> => {
  try {
    const query = `
      INSERT INTO job_service.job_reports (user_id, job_id, reason)
      VALUES ($1, $2, $3)
      returning *
    `;
    const values = [user_id, job_id, reason];
    const result = await db.query(query, values);
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error reporting job:", error);
    throw new Error("Database query failed");
  }
};
