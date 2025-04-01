/**
 * Interface representing an entry in 'usage' table that is used to enforce subscription rules on the
 * usage 
 * @interface
 * @property {number} user_id 
 * @property {number} messages_per_day - number of messages the user sent since (up to 24 hours) last_date
 * @property {number} connections - number of connections of the user with ID user_id
 * @property {number} job_applications_per_month - number of job applications by the user since (up to 1 month) last_date   
 * @property {number} messages_per_day_limit - maximum number of message the user can send in the duration of 24 hours after last_date
 * @property {number} connections_limit - maximum number of connections the user with user_id can make
 * @property {number} job_applications_limit - maximum number of job applications the user with user_id can make in the duration of 1 month after last_date 
 * @property {Date} last_date - reference date used to track usage and make sure usage doesn't break the limit
 */
export interface Usage {
    user_id : number,
    messages_per_day : number,
    connections : number,
    job_applications_per_month : number,
    messages_per_day_limit : number,
    conenctions_limit : number,
    job_applications_limit : number,
    last_date : Date
};