import { Job } from "./job";

export interface ReportedJob {
  id: number;
  job: Job;
  reporter_id: number;
  reason: string;
  status: string;
  created_at: Date;
}
