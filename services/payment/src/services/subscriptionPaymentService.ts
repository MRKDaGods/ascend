import db from "@shared/config/db";
import { Subscription } from "@ascend/shared/src/models/subscription";
import { changeFeatureEnabled, getFeatureLimits, getFeaturesPurchasedByUser } from "./featurePaymentService";
import { updateUsage } from "./usageService";


export const getSubscriptionById = async (subscription_id : string) : Promise<Subscription|null> => {
    const result = await db.query("SELECT * FROM payment_service.subscription_payment WHERE subscription_id = $1", [subscription_id]);
    return result.rows.length > 0 ? result.rows[0] : null; 
};

export const getSubscriptionsByUser = async (user_id : number) : Promise<Array<Subscription>> => {
    const result = await db.query("SELECT * FROM payment_service.subscription_payment WHERE user_id = $1", [user_id]);
    return result.rows;
};


export const insertSubscription = async (user_id : number, initial_session_id : string, subscription_plan : string, first_payment_date : Date, amount_paid : number, currency : string) : Promise<Subscription|null> => {
    const result = await db.query("INSERT INTO payment_service.subscription_payment user_id, initial_session_id, subscription_plan, first_payment_date, amount_paid, currency VALUES ($1, $2, $3, $4, $5, $6, $7)", [user_id, initial_session_id, subscription_plan, first_payment_date, amount_paid, currency]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

export const deleteSubscription = async (subscription_id : string) => {
    await db.query("DELETE FROM payment_service.subscription_payment WHERE subscription_id=$1", [subscription_id]);
};

export const getSubscriptionPlanLimits = async () : Promise<Map<string, any>> => {
    const results = await db.query("SELECT subscription_plan, messages_per_day_limit, job_applications_per_month_limit, connections_limit FROM payment_service.subscription_plans");
    let map = new Map<string, any>();
    for(const result of results.rows){
        map.set(result.subscription_plan, {...result});
    }
    return map;
};

export const disableFeaturesCoveredBySubscription = async (subcription_plan_limits : Map<string, any>, user_id : number) : Promise<void> => {
    const user_features  = await getFeaturesPurchasedByUser(user_id);
    const features_limits = await getFeatureLimits();
    let curr_feature_limits; 
    let restored_limits : any;
    const plan_limits = new Set(subcription_plan_limits.values());
    // enable features before subscription
    for(const feature of user_features){
        curr_feature_limits = features_limits.get(feature.feature_purchased);
        if(plan_limits.has(curr_feature_limits.usage_field_affected)){ 
            restored_limits[curr_feature_limits.usage_field_affected] = curr_feature_limits.limit;
            await changeFeatureEnabled(feature.session_id, true);
        }
    }
    await updateUsage(user_id, {messages_per_day_limit : -2, connections_limit : -2, job_applications_limit : -2, ...restored_limits});
};

export const enableFeaturesCoveredBySubscription = async (subcription_plan_limits : Map<string, any>, user_id : number) : Promise<void> => {
    const user_features  = await getFeaturesPurchasedByUser(user_id);
    const features_limits = await getFeatureLimits();
    let curr_feature_limits;
    const plan_limits = new Set(subcription_plan_limits.values());
     // disable old features
    for(const feature of user_features){
        curr_feature_limits = features_limits.get(feature.feature_purchased);
        if(plan_limits.has(curr_feature_limits.usage_field_affected)){
            await changeFeatureEnabled(feature.session_id, false);
        }
    }
};