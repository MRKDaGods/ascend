
/**
 * Inerface representing a company page in the system
 * 
 * @interface
 * @property {number} company_id - Unique identifier for the company
 * @property {string} company_name - Company name
 * @property {string} description - Breif description of the company and its buisness
 * @property {string} profile_photo_url - URL to the profile photo of the company page
 * @property {number} profile_photo_id - ID of profile photo
 * @property {string} cover_photo_url - URL to the profile photo of the company page
 * @property {number} cover_photo_id - ID of cover photo
 * @property {string} location - location of company's main headquarters
 * @property {string} industry - description of the category of the companies activity
 * @property {Date} created_at - Timestamp of the company creation
 * @property {number} created_by - ID of the user that created the company
 */
export interface Company {
    company_id : number;
    company_name : string;
    description : string;
    profile_photo_url : string;
    profile_photo_id : number;
    cover_photo_url : string;
    cover_photo_id : number;
    location : string;
    industry : string;
    created_at : Date;
    created_by : number;
    company_domain_name : string;
};