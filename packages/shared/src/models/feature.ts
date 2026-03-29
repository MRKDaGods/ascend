/**
 * Interface representing a feature purchase by a user
 * @interface
 * @property {number} user_id  
 * @property {string} session_id - used to retreive information about the checkout session from stripe API
 * @property {string} feature_purchased 
 * @property {Date} payment_date 
 * @property {number} amount_paid
 * @property {string} currency
 * @property {boolean} enabled
 */
export interface Feature {
    user_id : number,
    session_id : string,
    feature_purchased : string,
    payment_date : Date,
    amount_paid : number,
    currency : string,
    enabled : boolean
};
