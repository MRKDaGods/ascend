
/**
 * Inerface representing a company announcement in the system
 * 
 * @interface
 * @property {number} id - Unique identifier for the job
 * @property {number} company_id - ID of the company offering the announcement
 * @property {Date} created_at - Timestamp of the creation of the job post 
 * @property {number} posted_by - ID of the user who created the job post
 * @property {string} contet - Announcement contnet 
 * @property {boolean} is_active - a boolean indicatig whether both the creater of the post and 
 *                                 the company are still in the system 
 * 
 */

export interface Announcement {
    id: number;
    company_id: number;
    created_at: Date;
    posted_by: number;
    content : string;
    is_active: boolean;
};