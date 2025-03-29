import db from "@ascend/shared/src/config/db";
import { JobApplication, ApplicationStatus } from "@shared/models/job_application";

export const findJobApplicationById = async (id : number) : Promise<JobApplication| null> => {
    const result = await db.query("SELECT * FROM company_service.job_application WHERE application_id = $1", [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

export const findJobApplicationsToJob = async (job_id: number, limit: number = -1, offset: number = 0): Promise<Array<JobApplication>> => {
    let result;
    if (limit === -1) {
        result = await db.query("SELECT * FROM company_service.job_application WHERE job_id = $1", [job_id]);
    } else {
        result = await db.query("SELECT * FROM company_service.job_application WHERE job_id = $1 LIMIT $2 OFFSET $3", [job_id, limit, offset * limit]);
    }
    return result.rows;
};

export const findJobApplicationsToCompany = async (company_id: number, limit: number = -1, offset: number = 0): Promise<Array<JobApplication>> => {
    let result;
    if (limit === -1) {
        result = await db.query(`SELECT (company_service.job_application.application_id, company_service.job_application.user_id, company_service.job_application.job_id, company_service.job_application.status, company_service.job_application.applied_at) 
                                 FROM company_service.job_application 
                                 INNER JOIN company_service.job ON company_service.job.job_id = company_service.job_application.job_id
                                 INNER JOIN company_service.company ON company_service.job.company_id = $1`, [company_id]);
    } else {
        result = await db.query(`SELECT * FROM (
            SELECT (company_service.job_application.application_id, company_service.job_application.user_id, company_service.job_application.job_id, company_service.job_application.status, company_service.job_application.applied_at) 
            FROM company_service.job_application 
            INNER JOIN company_service.job ON company_service.job.job_id = company_service.job_application.job_id
            INNER JOIN company_service.company ON company_service.job.company_id = $1) AS full_result LIMIT $2 OFFSET $3`, [company_id, limit, offset * limit]);
    }
    return result.rows;
};

export const findJobApplicationsForUser = async (user_id: number, limit: number = -1, offset: number = 0): Promise<Array<JobApplication>> => {
    let result;
    if (limit === -1) {
        result = await db.query("SELECT * FROM company_service.job_application WHERE user_id = $1", [user_id]);
    } else {
        result = await db.query("SELECT * FROM company_service.job_application WHERE user_id = $1 LIMIT $2 OFFSET $3", [user_id, limit, offset * limit]);
    }
    return result.rows;
};


export const updateJobAppStatus = async (id : number, new_status : ApplicationStatus) : Promise<JobApplication|null> => {
    const result = await db.query("UPDATE company_service.job_application SET status = $1 WHERE application_id = $2 RETURNING *", [new_status as ApplicationStatus, id]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

export const findNumberOfJobApplicationsForCompany = async (company_id : number) : Promise<any> => {
    const result = await db.query(`SELECT company_service.job_application.status, COUNT(*) 
                                 FROM company_service.job_application 
                                 INNER JOIN company_service.job ON company_service.job.job_id = company_service.job_application.job_id
                                 INNER JOIN company_service.company ON company_service.job.company_id = $1 GROUP BY GROUPING SETS (
                                 (company_service.job_application.status),  -- Group by status
                                 ()  -- This represents the ROLLUP (grand total)
                                 )`, [company_id]);
    let map : any = {};
    for(let i = 0; i < result.rows.length; i++){
        if(result.rows[i] === null){
            map["total"] = result.rows[i].row_count;
        }else{
            map[result.rows[i].status] = result.rows[i].row_count;
        }
    } 

    return map;
};

export const createJobApplication = async (
    job_id : number,
    user_id : number,
    applied_at : Date,
    status : ApplicationStatus,
) : Promise<Array<JobApplication>> => {
    const result = await db.query("INSERT INTO company_service.job_application (job_id, user_id, applied_at, status) VALUES ($1, $2, $3, $4)", [job_id, user_id, applied_at, status as ApplicationStatus]);
    return result.rows;
};

export const deleteJobApplication = async (id : number) : Promise<boolean> => {
    const result = await db.query("DELETE FROM company_service.job_application WHERE application_id = $1 RETURNING *", [id]);
    return result.rows.length > 0;
};