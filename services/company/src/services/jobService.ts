import db from "@ascend/shared/src/config/db";
import { ExperienceLevel, Job } from "@shared/models/job";

export const findJobById = async (id: number) : Promise<Job|null> => {
    const result = await db.query("SELECT * FROM company_service.job WHERE job_id = $1", [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

export const findJobsByCompanyId = async (company_id: number) : Promise<Array<Job>> => {
    const result = await db.query("SELECT * FROM company_service.job WHERE company_id = $1", [company_id]);
    return result.rows;
}

export const createJob = async (
    company_id : number,
    title : string,
    description : string,
    location : string,
    industry : string,
    maximum_salary : number,
    minimum_salary : number,
    created_at : Date, 
    experience_level : ExperienceLevel,
    user_id : number
) : Promise<Job> => {
    const result = await db.query("INSERT INTO company_service.job (company_id, title, description, location, industry, maximum_salary, minimum_salary, experience_level, posted_by, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [company_id, title, description, location, industry, maximum_salary, minimum_salary, experience_level, user_id, created_at]
    );
    return result.rows[0];
}

export const findJobsPostedByUserId = async (user_id: number) : Promise<Array<Job>> => {
    const result = await db.query("SELECT * FROM company_service.job WHERE posted_by = $1", [user_id]);
    return result.rows;
}

export const findJobsWithExperienceLevel = async (experience_level : ExperienceLevel) : Promise<Array<Job>> => {
    const result = await db.query("SELECT * FROM company_service.job WHERE experience_level = $1", [experience_level]);
    return result.rows;
}

export const findJobsByKeyword = async (keywords : {[key : string] : any}) : Promise<Array<Job>> => {
    const {title, description, location, industry, experience_level} = keywords;
    let counter : number = 0;
    let db_query : string = "SELECT * FROM company_service.job WHERE ";
    let parametrs : Array<string> = [];
    if(experience_level){
        counter += 1;
        db_query += `title = ${counter} AND `;
        parametrs.push(experience_level);
    }

    if(title){
        counter += 1;
        db_query += `title = ${counter} AND `;
        parametrs.push(title);
    }

    if(description){
        counter += 1;
        db_query += `description = ${counter} AND `;
        parametrs.push(description);
    }

    if(location){
        counter += 1;
        db_query += `location = ${counter} AND `;
        parametrs.push(location);
    }
    if(industry){
        counter += 1;
        db_query += `industry = ${counter} AND `;
        parametrs.push(industry);
    }

    db_query = db_query.substring(0, db_query.lastIndexOf("AND"));

    const result = await db.query(db_query, parametrs);
    return result.rows;
}


export const findJobsCreatedAt = async (date : Date) : Promise<Array<Job>> => {
    const result = await db.query("SELECT * FROM company_service.job WHERE DATE(created_at) = $1", [date])
    return result.rows;
}



export const findJobsWithSalaryBetween = async (salary : number) : Promise<Array<Job>> => {
    const result = await db.query("SELECT * FROM company_service.job WHERE max_salary >= $1 AND min_salary <= $1", [salary])
    return result.rows;
}

export const findJobsCreatedBefore = async (date : Date) : Promise<Array<Job>> => {
    const result = await db.query("SELECT * FROM company_service.job WHERE DATE(created_at) < $1", [date])
    return result.rows;
}


export const findJobsCreatedAfter = async (date : Date) : Promise<Array<Job>> => {
    const result = await db.query("SELECT * FROM company_service.job WHERE DATE(created_at) > $1", [date])
    return result.rows;
}


export const findJobsCreatedBetween = async (date1 : Date, date2 : Date) : Promise<Array<Job>> => {
    const result = await db.query("SELECT * FROM company_service.job WHERE DATE(created_at) >= $1 AND DATE(created_at) <= $2", [date1, date2])
    return result.rows;
}

export const deleteJob = async (id : number) : Promise<void> => {
    await db.query("DELETE FROM company_service.job WHERE job_id = $1", [id]);
}

