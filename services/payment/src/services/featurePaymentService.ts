import db from "@shared/config/db";
import { FeaturePayment } from "@shared/models/feature_payment";

export const getFeaturePaymentBySessionId = async (session_id : string) : Promise<FeaturePayment|null> => {
    const result = await db.query("SELECT * FROM payment_service.feature_payment WHERE session_id = $1", [session_id]);
    return result.rows.length > 0 ? result.rows[0] : null; 
};

export const getFeaturePaymentsByUser = async (user_id : number) : Promise<Array<FeaturePayment>> => {
    const result = await db.query("SELECT * FROM payment_service.feature_payment WHERE user_id = $1", [user_id]);
    return result.rows;
};


export const insertFeaturePayment = async (user_id : number, session_id : string, feature_purchased : string, payment_date : Date, amount_paid : number, currency : string) : Promise<FeaturePayment|null> => {
    const result = await db.query("INSERT INTO payment_service.feature_payment (user_id, session_id, feature_purchased, payment_date, amount_paid, currency, is_successful) VALUES ($1, $2, $3, $4, $5, $6)", [user_id, session_id, feature_purchased, payment_date, amount_paid, currency]);
    return result.rows.length > 0 ? result.rows[0] : null;
};


export const getFeatureLimits = async () : Promise<Map<string, any>> => {
    const results = await db.query("SELECT (feature_name , usage_field_affected , limit) FROM payment_service.features_limit");
    let map = new Map<string, any>();
    for(const result of results.rows){
        map.set(result[0], {usage_field_affected : result[1], limit : result[2]});
    }

    return map;
}