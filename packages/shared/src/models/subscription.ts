/**
 * Interface representing a user's subscription
 * @interface
 * @property {number} user_id  
 * @property {string} initial_session_id - the ID of the initial session used to make the subcription
 * @property {string} subscription_id
 * @property {string} subscription_plan 
 * @property {Date}   first_payment_date - the first time the user payed for the subscription 
 * @property {number} amount_paid
 * @property {string} currency
 */
export interface Subscription {
    user_id : number,
    initial_session_id : string,
    subscription_id : string,
    subscription_plan : string,
    first_payment_date : Date,
    amount_paid : number,
    currency : string
};
