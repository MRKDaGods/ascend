
/**
 * Inerface representing a company announcement post in the system
 * 
 * @interface
 * @property {number} announcement_id - Unique identifier for the job
 * @property {number} company_id - ID of the company offering the announcement
 * @property {Array<number>} image_ids - IDs to the image in the announcement post (not optional - must be an empty list if there are no images)
 * @property {number} video_id  - video ID (optional)
 * @property {Date} created_at - Timestamp of the creation of the job post 
 * @property {number} posted_by - ID of the user who created the job post
 * @property {string} contet - Announcement contnet 
 * 
 */

export interface Announcement {
    announcement_id: number;
    company_id: number;
    image_ids : Array<number>; 
    video_id? : number;
    created_at: Date;
    posted_by: number;
    content : string;
};