import { Services } from "@shared/index";
import db from "@shared/config/db";
import { Company } from "@shared/models/company";

export const getJobAnalyticsOfCompany = async (company_id : number) : Promise<Array<any>> => {
    const results = await db.query(`SELECT j.job_id AS "jobId", j.title AS "name", COUNT(*) FILTER (WHERE a.status = 'Pending') AS pending, COUNT(*) FILTER (WHERE a.status = 'Viewed') AS viewed, COUNT(*) FILTER (WHERE a.status = 'Accepted') AS accepted, COUNT(*) FILTER (WHERE a.status = 'Rejected') AS rejected FROM job_service.applications a JOIN job_service.jobs j ON j.job_id = a.job_id WHERE j.company_id = $1 GROUP BY j.job_id, j.title`, [company_id]);
    return results.rows;
}

export const getNumberOfJobPosts = async (company_id : number) : Promise<number> => {
    const result = await db.query("SELECT COUNT(*) FROM job_service.jobs WHERE job_service.jobs.company_id = $1", [company_id]);
    return result.rows.length > 0 ? parseInt(result.rows[0].count) : 0;
}