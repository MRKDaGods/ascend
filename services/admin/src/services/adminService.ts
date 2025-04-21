import db from "@shared/config/db";
import { ReportedJob } from "packages/shared/src/models/report";

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
      JOIN job_service.jobs AS j ON r.job_id = j.id
      JOIN company_services.companies AS c ON j.company_id = c.id
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
        company_name: row.company_name,
        company_logo_url: row.company_logo_url,
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
