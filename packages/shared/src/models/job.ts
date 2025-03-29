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
 * @property {number} job_id - Unique identifier for the job
 * @property {number} company_id - ID of the company offering the job
 * @property {string} title - Job title
 * @property {string} description - Breif description of the job
 * @property {string} location - Site of the job
 * @property {string} industry - Description of the category of the job
 * @property {number} salary_range_max - Maximum salary 
 * @property {number} salary_range_min - Minimum salary
 * @property {Date} created_at - Timestamp of the creation of the job post 
 * @property {ExperienceLevel} experience_level - Level of experience required for the job
 * @property {number} posted_by - ID of the user who created the job post
 * 
 */

export interface Job {
    job_id: number;
    company_id: number;
    title: string;
    description: string;
    location?: string;
    industry: string;
    salary_range_min?: number;
    salary_range_max?: number;
    created_at: Date;
    experience_level: ExperienceLevel;
    posted_by: number;
};