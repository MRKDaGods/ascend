/**
 * Interface representing a recurring payment for a subscription plan
 * @interface
 * @property {number} user_id  
 * @property {string} session_id - used to retreive information about the checkout session from stripe API
 * @property {string} subscription_plan 
 * @property {Date}   first_payment_date - the first time the user payed for the subscription 
 * @property {number} amount_paid
 * @property {string} currency
 * @property {Date}   latest_payment_date - the last time the user payed for the subscription
 */
export interface SubscriptionPayment {
    user_id : number,
    session_id : string,
    subscription_plan : string,
    first_payment_date : Date,
    latest_payment_date : Date,
    amount_paid : number,
    currency : string
};
