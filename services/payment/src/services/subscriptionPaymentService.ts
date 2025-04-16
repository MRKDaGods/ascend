import db from "@shared/config/db";
import { SubscriptionPayment } from "@shared/models/subscription_payment";


export const getSubscriptionPaymentBySessionId = async (session_id : string) : Promise<SubscriptionPayment|null> => {
    const result = await db.query("SELECT * FROM payment_service.subscription_payment WHERE session_id = $1", [session_id]);
    return result.rows.length > 0 ? result.rows[0] : null; 
};

export const getSubscriptionPaymentsByUser = async (user_id : number) : Promise<Array<SubscriptionPayment>> => {
    const result = await db.query("SELECT * FROM payment_service.subscription_payment WHERE user_id = $1", [user_id]);
    return result.rows;
};


export const insertSubscriptionPayment = async (user_id : number, session_id : string, subscription_plan : string, first_payment_date : Date, latest_payment_date : Date, amount_paid : number, currency : string) : Promise<SubscriptionPayment|null> => {
    const result = await db.query("INSERT INTO payment_service.subscription_payment (user_id, session_id, subscription_plan, first_payment_date, latest_payment_date, amount_paid, currency) VALUES ($1, $2, $3, $4, $5, $6, $7)", [user_id, session_id, subscription_plan, first_payment_date, latest_payment_date, amount_paid, currency]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

export const getSubscriptionPlans = async () : Promise<Map<string, any>> => {
    const results = await db.query("SELECT (subscription_plan, messages_per_day_limit, job_applications_per_month_limit, connections_limit) FROM payment_service.subscription_plans");
    let map = new Map<string, any>();
    for(const result of results.rows){
        map.set(result[0], {messages_per_day_limit : result[1], job_applications_per_month_limit : result[2], connections_limit : result[3]});
    }

    return map;
};

// export const deleteSubscription = async ()