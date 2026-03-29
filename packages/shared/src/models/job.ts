export interface SavedJob {
  job_id: number;
  saved_at: Date;
}

// Interface for job application response
export interface Application {
  application_id: number;
  user_id: number;
  job_id: number;
  resume_url: string;
  email: string;
  phone: string;
  status: string;
  applied_at: Date;
}

// Interface for getting job applications for user
export interface JobApplicationForUser {
  application_id: number;
  job: Job;
  resume_url: string;
  email: string;
  phone: string;
  status: string;
  applied_at: Date;
}

export interface Job {
  job_id: number;
  title: string;
  description: string;
  industry: string;
  type: string;
  experience_level: string;
  location: string;
  workplace_type: string;
  salary_min_range: number | null;
  salary_max_range: number | null;
  company_id: number;
  company_name: string;
  company_logo_url: string | null;
  created_at: Date;
}
