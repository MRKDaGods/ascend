import db from "@shared/config/db";
import { Usage } from "@shared/models/usage";
import { getSubscriptionPlanLimits } from "./subscriptionPaymentService";

export const getUsageByUserId = async (user_id : number) : Promise<Usage|null> => {
    const result = await db.query("SELECT * FROM payment_service.usage WHERE user_id = $1", [user_id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

export const getUsageByCustomerId = async (customer_id : string) : Promise<Usage|null> => {
    const result = await db.query("SELECT * FROM payment_service.usage WHERE customer_id = $1", [customer_id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};


export const insertUsage = async (user_id : number, last_date : Date) : Promise<Usage|null> => {
    const subscription_plans_limits = await getSubscriptionPlanLimits();
    const basic_plan_limits = subscription_plans_limits.get('basic plan');
    const result = await db.query("INSERT INTO payment_service.usage (user_id, last_date, messages_per_day_limit, job_applications_limit, connections_limit) VALUES ($1, $2, $3, $4, $5)", [user_id, last_date, basic_plan_limits.messages_per_day_limit, basic_plan_limits.job_applications_per_month_limit, basic_plan_limits.connections_limit]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

export const updateUsage = async (user_id: number , { messages_per_day = -3, connections = -3, job_applications_per_month = -3, messages_per_day_limit = -3, connections_limit = -3, job_applications_limit = -3, last_date = null, stripe_customer_id = ""} : {messages_per_day? : number , connections? : number , job_applications_per_month? : number , messages_per_day_limit? : number , connections_limit? : number , job_applications_limit? : number, last_date? : Date|null , stripe_customer_id? : string}) : Promise<Usage|null> => {
    let db_query = "UPDATE payment_service.usage SET ";
    let counter = 0;
    let parameters = [];
    const basic_plan_limits = (await getSubscriptionPlanLimits()).get('basic plan');
    console.log(`basic paln : ${JSON.stringify(basic_plan_limits)}`);

    console.log('oooh');
    if(messages_per_day !== -3){
        counter += 1;
        parameters.push(messages_per_day);
        db_query += `messages_per_day = $${counter} , `;
    }

    if(connections !== -3){
        counter += 1;
        parameters.push(connections);
        db_query += `connections = $${counter} , `;
    }

    if(job_applications_per_month !== -3){
        counter += 1;
        parameters.push(job_applications_per_month);
        db_query += `job_applications_per_month = $${counter} , `;
    }

    if(messages_per_day_limit === -2){
        console.log('eyeee!!!');
        counter += 1;
        parameters.push(basic_plan_limits.messages_per_day_limit);
        db_query += `messages_per_day_limit = $${counter} , `;
    }else if(messages_per_day_limit !== -3){
        console.log('eyeee+++++');
        counter += 1;
        parameters.push(messages_per_day_limit);
        db_query += `messages_per_day_limit = $${counter} , `;
    }

    if(connections_limit === -2){
        counter += 1;
        parameters.push(basic_plan_limits.connections_limit);
        db_query += `connections_limit = $${counter} , `;
    }else if(connections_limit !== -3){
        counter += 1;
        parameters.push(connections_limit);
        db_query += `connections_limit = $${counter} , `;
    }

    if(job_applications_limit === -2){
        counter += 1;
        parameters.push(basic_plan_limits.job_applications_limit);
        db_query += `job_applications_limit = $${counter} , `;
    }else if(job_applications_limit !== -3){
        counter += 1;
        parameters.push(job_applications_limit);
        db_query += `job_applications_limit = $${counter} , `;
    }

    if(last_date !== null){
        counter += 1;
        parameters.push(last_date);
        db_query += `last_date = $${counter} , `;
    }

    if(stripe_customer_id !== ""){
        counter += 1;
        parameters.push(stripe_customer_id);
        db_query += `stripe_customer_id = $${counter}, `;
    }else{
        counter += 1;
        parameters.push(null);
        db_query += `stripe_customer_id = $${counter}, `;
    }


    db_query = db_query.substring(0, db_query.lastIndexOf(","));

    counter += 1;
    db_query += ` WHERE user_id = $${counter} RETURNING *`;
    parameters.push(user_id);

    console.log(`query ------------------------ ${db_query}`);
    const result = await db.query(db_query, parameters);
    return result.rows.length > 0 ? result.rows[0] : null;
};