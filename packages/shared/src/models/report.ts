export interface JobReport {
  id: number;
  reporter_id: number;
  reporter_full_name: string;
  reporter_profile_picture: string | null;
  reason: string;
  status: string;
  created_at: Date;
}

export interface PostReport {
  id: number;
  reporter_id: number;
  reporter_full_name: string;
  reporter_profile_picture: string | null;
  reason: string;
  description: string;
  status: string;
  admin_comment: string;
  created_at: Date;
  updated_at: Date;
}
