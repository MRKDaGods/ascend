

/**
 * Inerface representing a user-following-company relationship in the system
 * 
 * @interface
 * @property {number} follower_id - Unique identifier for the following user
 * @property {number} company_id - Unique identifier for the company
 * @property {Date} created_at - Timestamp of the company creation 
 */
export interface Follows {
    follower_id : number;
    company_id : number;
    created_at : Date;
};