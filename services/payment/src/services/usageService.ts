import db from "@shared/config/db";
import { Usage } from "@shared/models/usage";

export const getUsageByUserId = async (user_id : number) : Promise<Usage|null> => {
    const result = await db.query("SELECT * FROM payment_service.usage WHERE user_id = $1", [user_id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

export const insertUsage = async (user_id : number, last_date : Date, stripe_customer_id : string) : Promise<Usage|null> => {
    const result = await db.query("INSERT INTO payment_service.usage (user_id, last_date, stripe_customer_id) VALUES ($1, $2, $3)", [user_id, last_date, stripe_customer_id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

export const updateUsage = async ({user_id , messages_per_day = -1, connections = -1, job_applications_per_month = -1, messages_per_day_limit = -1, connections_limit = -1, job_applications_limit = -1, last_date = null, stripe_customer_id = ""} : {user_id : number , messages_per_day? : number , connections? : number , job_applications_per_month? : number , messages_per_day_limit? : number , connections_limit? : number , job_applications_limit? : number, last_date? : Date|null , stripe_customer_id? : string}) : Promise<Usage|null> => {
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

    if(stripe_customer_id !== ""){
        counter += 1;
        parameters.push(stripe_customer_id);
        db_query += `stripe_customer_id = $${stripe_customer_id}`;
    }


    db_query = db_query.substring(0, db_query.lastIndexOf(","));

    counter += 1;
    db_query += ` WHERE user_id = $${counter} RETURNING *`;
    parameters.push(user_id);

    const result = await db.query(db_query, parameters);
    return result.rows.length > 0 ? result.rows[0] : null;
};