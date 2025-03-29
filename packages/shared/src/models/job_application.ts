/**
 * Enum representing the possible statuses of a job application.
 */
export enum ApplicationStatus {
    PENDING = "pending",
    VIEWED = "viewed",
    REJECTED = "rejected",
    ACCEPTED = "accepted"
};

/**
 * Interface representing a job application in the system.
 * 
 * @interface
 * @property {number} application_id - Unique identifier for the job application
 * @property {number} job_id - ID of the job being applied for
 * @property {number} user_id - ID of the user who submitted the application
 * @property {Date} applied_at - Timestamp when the application was submitted
 * @property {ApplicationStatus} status - Current status of the job application
 */
export interface JobApplication {
    application_id: number;
    job_id: number;
    user_id: number;
    applied_at: Date;
    status: ApplicationStatus;
};
