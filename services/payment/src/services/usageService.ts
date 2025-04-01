import db from "@shared/config/db";
import { Usage } from "@shared/models/usage";

export const getUsageByUserId = async (user_id : number) : Promise<Usage|null> => {
    const result = await db.query("SELECT * FROM payment_service.usage WHERE user_id = $1", [user_id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

export const insertUsage = async (user_id : number, last_date : Date) : Promise<Usage|null> => {
    const result = await db.query("INSERT INTO payment_service.usage (user_id, last_date) VALUES ($1, $2)", [user_id, last_date]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

export const updateUsage = async (user_id : number, messages_per_day : number = -1, connections : number = -1, job_applications_per_month: number = -1, messages_per_day_limit : number = -1, connections_limit : number = -1, job_applications_limit : number = -1, last_date : Date|null = null) : Promise<Usage|null> => {
    let db_query = "UPDATE payment_service.usage SET ";
    let counter = 0;
    let parameters = [];
    if(messages_per_day !== -1){
        counter += 1;
        parameters.push(messages_per_day);
        db_query += `messages_per_day = $${counter} , `;
    }

    if(connections !== -1){
        counter += 1;
        parameters.push(connections);
        db_query += `connections = $${counter} , `;
    }

    if(job_applications_per_month !== -1){
        counter += 1;
        parameters.push(job_applications_per_month);
        db_query += `job_applications_per_month = $${counter} , `;
    }

    if(messages_per_day_limit !== -1){
        counter += 1;
        parameters.push(messages_per_day_limit);
        db_query += `messages_per_day_limit = $${counter} , `;
    }

    if(connections_limit !== -1){
        counter += 1;
        parameters.push(connections_limit);
        db_query += `connections_limit = $${counter} , `;
    }

    if(job_applications_limit !== -1){
        counter += 1;
        parameters.push(job_applications_limit);
        db_query += `job_applications_limit = $${counter} , `;
    }

    if(!last_date){
        counter += 1;
        parameters.push(last_date);
        db_query += `last_date = $${counter} , `;
    }


    db_query = db_query.substring(0, db_query.lastIndexOf(","));

    counter += 1;
    db_query += ` WHERE user_id = $${counter} RETURNING *`;
    parameters.push(user_id);

    const result = await db.query(db_query, parameters);
    return result.rows.length > 0 ? result.rows[0] : null;
};