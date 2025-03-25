import db from "@ascend/shared/src/config/db";
import { JobApplication, ApplicationStatus } from "@shared/models/job_application";

export const findJobApplicationById = async (id : number) : Promise<JobApplication| null> => {
    const result = await db.query("SELECT * FROM company_service.job_application WHERE application_id = $1", [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

export const findJobApplicationsToJob = async (job_id : number) : Promise<Array<JobApplication>> => {
    const result = await db.query("SELECT * FROM company_Service.job_application WHERE job_id = $1", [job_id]);
    return result.rows;
}

export const findJobApplicationsForUser = async (user_id : number) : Promise<Array<JobApplication>> => {
    const result = await db.query("SELECT * FROM company_Service.job_application WHERE user_id = $1", [user_id]);
    return result.rows;
}

export const updateJobApplicationStatus = async (id : number, new_status : ApplicationStatus) : Promise<JobApplication|null> => {
    const result = await db.query("UPDATE company_service.job_application SET status = $1 WHERE application_id = $2", [new_status, id]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

export const createJobApplication = async (
    job_id : number,
    user_id : number,
    applied_at : Date,
    status : ApplicationStatus,
) : Promise<Array<JobApplication>> => {
    const result = await db.query("INSERT INTO company_service.job_application (job_id, user_id, applied_at, status) VALUES ($1, $2, $3, $4)");
    return result.rows;
}

export const deleteJobApplication = async (id : number) : Promise<void> => {
    await db.query("DELETE FROM company_service.job_application WHERE application_id = $1", [id]);
}