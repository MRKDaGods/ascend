import db from "@shared/config/db";
import { Feature } from "@ascend/shared/src/models/feature";

export const getFeatureBySessionId = async (session_id : string) : Promise<Feature|null> => {
    const result = await db.query("SELECT * FROM payment_service.feature_payment WHERE session_id = $1", [session_id]);
    return result.rows.length > 0 ? result.rows[0] : null; 
};

export const getFeaturesPurchasedByUser = async (user_id : number) : Promise<Array<Feature>> => {
    const result = await db.query("SELECT * FROM payment_service.feature_payment WHERE user_id = $1", [user_id]);
    return result.rows;
};


export const insertFeature = async (user_id : number, session_id : string, feature_purchased : string, payment_date : Date, amount_paid : number, currency : string, enabled : boolean) : Promise<Feature|null> => {
    const result = await db.query("INSERT INTO payment_service.feature_payment (user_id, session_id, feature_purchased, payment_date, amount_paid, currency, enabled) VALUES ($1, $2, $3, $4, $5, $6, $7)", [user_id, session_id, feature_purchased, payment_date, amount_paid, currency, enabled]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

export const changeFeatureEnabled = async (session_id : string, enabled : boolean) : Promise<Feature|null> => {
    const result = await db.query(`UPDATE payment_service.feature_payment SET enabled=$1 WHERE session_id=$2 RETURNING *`, [enabled, session_id]);
    return result.rows.length > 0 ? result.rows[0] : null;
}


export const getFeatureLimits = async () : Promise<Map<string, any>> => {
    const results = await db.query(`SELECT feature_name , usage_field_affected , "limit" FROM payment_service.feature_limits`);
    let map = new Map<string, any>();
    for(const result of results.rows){
        map.set(result.feature_name, {usage_field_affected : result.usage_field_affected, limit : result.limit});
    }

    return map;
}