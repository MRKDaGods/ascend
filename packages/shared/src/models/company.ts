
/**
 * Inerface representing a company in the system
 * 
 * @interface
 * @property {number} id - Unique identifier for the company
 * @property {string} company_name - Company name
 * @property {string} description - Breif description of the company and its buisness
 * @property {string} logo_url - URL to an image of the company's logo
 * @property {string} location - location of company's main headquarters
 * @property {string} industry - description of the category of the companies activity
 * @property {Date} created_at - Timestamp of the company creation
 * @property {number} created_by - ID of the user that created the company
 * @property {boolean} is_active - a boolean indicatig whether the creater of the company is still in the system 
 */
export interface Company {
    id : number;
    company_name : string;
    description : string;
    logo_url : string;
    location : string;
    industry : string;
    created_at : Date;
    created_by : number;
    is_active : boolean;
};