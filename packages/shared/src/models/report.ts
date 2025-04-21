import { Job } from "./job";
import { Post } from "./post";

export interface ReportedJob {
  id: number;
  job: Job;
  reporter_id: number;
  reason: string;
  status: string;
  created_at: Date;
}

export interface ReportedPost {
  id: number;
  post: Post;
  reporter_id: number;
  reason: string;
  description: string;
  status: string;
  admin_comment: string;
  created_at: Date;
  updated_at: Date;
}
