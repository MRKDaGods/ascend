export enum ExperienceLevel {
    Internship = "Internship",
    Entry_Level = "Entry Level",
    Associate = "Associate",
    Mid_Senior_Level = "Mid-Senior Level",
    Director = "Director",
};

export interface SavedJob {
    user_id: number;
    job_id: number;
    saved_at: Date;
};

export interface JobApplication {
    application_id: number;
    user_id: number;
    job_id: number;
    status: string;
    applied_at: Date;
};

export interface Job {
    id: number;
    title: string;
    description: string;
    location?: string;
    industry: string;
    experience_level: ExperienceLevel;
    salary_range_min?: number;
    salary_range_max?: number;
    company_id: number;
    posted_by: number;
    created_at: Date;
};