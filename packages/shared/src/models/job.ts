export enum ExperienceLevel  {
    STUDENT = "student",
    ENTRY_LEVLEL = "entry level",
    ASSOCIATE = "associate",
    MID_SENIOR_LEVEL = "mid-senior level",
    DIRECTOR = "director",
    EXECUTIVE = "executive" 
};


/**
 * Inerface representing a job post in the system
 * 
 * @interface
 * @property {number} id - Unique identifier for the job
 * @property {number} company_id - ID of the company offering the job
 * @property {string} title - Job title
 * @property {string} description - Breif description of the job
 * @property {string} location - Site of the job
 * @property {string} industry - Description of the category of the job
 * @property {number} maximum_salary - Maximum salary 
 * @property {number} minimum_salary - Minimum salary
 * @property {Date} created_at - Timestamp of the creation of the job post 
 * @property {ExperienceLevel} experience_level - Level of experience required for the job
 * @property {number} posted_by - ID of the user who created the job post
 * @property {boolean} is_active - a boolean indicatig whether both the creater of the post and 
 *                                 the company are still in the system 
 * 
 */

export interface Job {
    id: number;
    company_id: number;
    title: string;
    description: string;
    location: string;
    industry: string;
    maximum_salary: number;
    minimum_salary: number;
    created_at: Date;
    experience_level: ExperienceLevel;
    posted_by: number;
    is_active: boolean;
};