

/**
 * Inerface representing a user-following-company relationship in the system
 * 
 * @interface
 * @property {number} follower_id - Unique identifier for the following user
 * @property {number} company_id - Unique identifier for the company
 * @property {Date} created_at - Timestamp of the company creation 
 * @property {string} first_name - Follower's first name
 * @property {string} last_name - Follower's last name
 * @property {string} profile_photo_url - Follower's profile photo
 */
export interface Follows {
    follower_id : number;
    company_id : number;
    created_at : Date;
    first_name : string,
    last_name : string,
    profile_photo_url : string
};