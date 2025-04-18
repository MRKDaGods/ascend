export interface SavedJob {
  job_id: number;
  saved_at: Date;
}

export interface Application {
  application_id: number;
  user_id: number;
  job_id: number;
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
  location?: string;
  workplace_type?: string;
  salary_range_min?: number;
  salary_range_max?: number;
  company_id: number;
  user_id: number;
  created_at: Date;
}
