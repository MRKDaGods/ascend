import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import { Response } from "express";
import { createCompany, deleteCompany, findCompaniesCreatedByUser, findCompanyById, updateCompanyProfile } from "../services/companyService";
import { createJob, deleteJob, findJobById, findJobsByCompanyId, findNumberOfJobPostForCompany } from "../services/jobService";
import { ExperienceLevel } from "@shared/models/job";
import { createFollowRelationShip, deleteFollowRelationShip, findFollowersOfCompany, findNumberOfFollowersOfCompany } from "../services/followsService";
import { findJobApplicationsToCompany, findNumberOfJobApplicationsForCompany, updateJobAppStatus } from "../services/jobApplicationService";
import { createAnnouncement, deleteAnnouncement, findAnnouncementById, findAnnouncementsByCompanyId, findNumberOfAnnouncements } from "../services/announcementService";
import { title } from "process";
import { describe } from "node:test";
import { ApplicationStatus } from "@shared/models/job_application";

export const createCompanyProfile = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    const {name, description, industry, location, logoUrl} = req.body;
    try {
        const date = new Date();
        const company = await createCompany(name, description, logoUrl, location, industry, date, user_id);
        if(company){
            return res.status(200).json({
                data : {
                    company : company
                },
                error : null
            });
        }else{
            return res.status(500).json({error : "failed to create company profile"});
        }
    }catch(e){
        console.log(`Internal error : ${e}`)
        return res.status(500).json({error : "Internal error : "})
    }
}

export const deleteCompanyProfile = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }
    const company_id = parseInt(req.params.companyId, 10);    
    try {
        const company = await findCompanyById(company_id);
        if(!company){
            return res.status(404).json({error : "company not found"});
        }
        if(company?.created_by !== user_id){
            return res.status(401).json({error : "unauthorized"});
        }
        const company_deleted = await deleteCompany(company_id);
        if(company_deleted){
            return res.status(200).json({
                data : {
                    msg : "Company profile deleted successfully"
                },
                error : null
            });
        }else{
            return res.status(500).json({error : "Failed to delete company"});
        }
    }catch(e){
        console.log(`Internal error : ${e}`)
        return res.status(500).json({error : "Internal error"});
    }
};

export const getCompaniesCreatedByUser = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }
    try {
        const companies = await findCompaniesCreatedByUser(user_id);
        return res.status(200).json({
            data : {
                companies : companies
            },
            error : null
        });
    }catch(e){
        console.log(`Internal error : ${e}`)
        return res.status(500).json({error : "Internal error"});
    }    
}

export const updateCompany = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }
    const company_id = parseInt(req.params.companyId, 10);
    const {description, industry, location, logoUrl} = req.body;
    try {
        const company = await findCompanyById(company_id);
        if(!company){
            return res.status(404).json({error : "company not found"});
        }
        if(company?.created_by !== user_id){
            return res.status(401).json({error : "unauthorized"});
        }
        const updated_company = await updateCompanyProfile(company_id, {location : location, description : description, industry : industry, logo_url : logoUrl});
               
        return res.status(200).json({
            data : {
                company : updated_company
            },
            error : null
        });
    }catch(e){
        console.log(`Internal error : ${e}`)
        return res.status(500).json({error : "Internal error"});
    }
};

export const getCompanyProfile = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }
    const company_id = parseInt(req.params.companyId, 10);
    try {
        const company = await findCompanyById(company_id);
        if(!company){
            return res.status(404).json({error : "company not found"});
        }
        if(company?.created_by !== user_id){
            return res.status(401).json({error : "unauthorized"});
        }
        return res.status(200).json({
            data : {
                company : company
            },
            error : null
        });
    }catch(e){
        console.log(`Internal error : ${e}`)
        return res.status(500).json({error : "Internal error"});
    }
};

export const createJobPost = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }
    const company_id = parseInt(req.params.companyId, 10);
    const {title , description, location, salaryRange, industry, experience_level} = req.body;
    try {
        const company = await findCompanyById(company_id);
        if(!company){
            return res.status(404).json({error : "company not found"});
        }
        if(company?.created_by !== user_id){
            return res.status(401).json({error : "unauthorized"});
        }
        const new_job_post = await createJob(company_id, title, description, location, industry, salaryRange.max, salaryRange.min, new Date(), experience_level as ExperienceLevel, user_id);
        return res.status(200).json({
            data : {
                job : new_job_post
            },
            error : null
        });
    }catch(e){
        console.log(`Internal error : ${e}`);
        return res.status(500).json({error : "Internal error"});
    }
};

export const deleteJobPost = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }
    const company_id = parseInt(req.params.companyId, 10);
    const job_id = parseInt(req.params.jobId, 10);    
    try {
        const company = await findCompanyById(company_id);
        const job = await findJobById(job_id);
        if(!company){
            return res.status(404).json({error : "company not found"});
        }
        if(!job){
            return res.status(404).json({error : "job not found"});
        }
        if(company?.created_by !== user_id || company?.company_id !== job?.company_id){
            return res.status(401).json({error : "unauthorized"});
        }
        const job_deleted = await deleteJob(job_id);
        if(job_deleted){
            return res.status(200).json({
                data : {
                    msg : "Job post deleted successfully"
                },
                error : null
            });
        }else{
            return res.status(400).json({error : "Failed to delete job post"});
        }
    }catch(e){
        console.log(`Internal error : ${e}`)
        return res.status(500).json({error : "Internal error"});
    }
};

export const getJobPost = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }
    const job_id = parseInt(req.params.jobId, 10);
    try {
        const job_post = await findJobById(job_id);
        if(job_post){
            return res.status(200).json({
                data : {
                    job : job_post
                },
                error : null
            });
        }else{
            return res.status(404).json({error : "Job post not found"});
        }
    }catch(e){
        console.log(`Internal error : ${e}`);
        return res.status(500).json({error : "Internal error"});
    }
};


export const createAnnounementPost = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }
    const company_id = parseInt(req.params.companyId, 10);
    const { content } = req.body;
    try {
        const company = await findCompanyById(company_id);
        if(!company){
            return res.status(404).json({error : "company not found"});
        }
        if(company?.created_by !== user_id){
            return res.status(401).json({error : "unauthorized"});
        }
        const new_announcement_post = await createAnnouncement(company_id, user_id, new Date(), content);
        return res.status(200).json({
            data : {
                announcement : new_announcement_post
            },
            error : null
        });
    }catch(e){
        console.log(`Internal error : ${e}`);
        return res.status(500).json({error : "Internal error"});
    }
};

export const deleteAnnouncementPost = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }
    const company_id = parseInt(req.params.companyId, 10);
    const announcement_id = parseInt(req.params.announcementId, 10);    
    try {
        const company = await findCompanyById(company_id);
        const announcement = await findAnnouncementById(announcement_id);
        if(!company){
            return res.status(404).json({error : "company not found"});
        }
        if(!announcement){
            return res.status(404).json({error : "announcement not found"});
        }
        if(company?.created_by !== user_id || company?.company_id !== announcement?.company_id){
            return res.status(401).json({error : "unauthorized"});
        }
        const announcement_deleted = await deleteAnnouncement(announcement_id); 
        if(announcement_deleted){
            return res.status(200).json({
                data : {
                    msg : "Announcement deleted successfully"
                },
                error : null
            });
        }else{
            return res.status(400).json({error : "Failed to delete announcement"});
        }
    }catch(e){
        console.log(`Internal error : ${e}`)
        return res.status(500).json({error : "Internal error"});
    }
};

export const getAnnouncement = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }
    const announcement_id = parseInt(req.params.announcementId, 10);
    try {
        const announcement = await findAnnouncementById(announcement_id);
        if(announcement){
            return res.status(200).json({
                data : {
                    announcement : announcement
                },
                error : null
            });
        }else{
            return res.status(404).json({error : "Announcement not found"});
        }
    }catch(e){
        console.log(`Internal error : ${e}`);
        return res.status(500).json({error : "Internal error"});
    }
};


export const getCompanyFollowers = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }
    const company_id = parseInt(req.params.companyId, 10);
    const limit : number = req.query.limit ? parseInt(req.query.limit as string) : -1;
    const page : number = req.query.page ? parseInt(req.query.page as string) : 0;
    try {
        const company = await findCompanyById(company_id);
        if(!company){
            return res.status(404).json({error : "company not found"});
        }
        if(company?.created_by !== user_id){
            return res.status(401).json({error : "unauthorized"});
        }
        let company_followers;
        if(limit === -1){
            company_followers = await findFollowersOfCompany(company_id);
        }else{
            company_followers = await findFollowersOfCompany(company_id, limit, page-1);
        }

        return res.status(200).json({
            data : {
                followers : company_followers
            }, 
            error : null            
        });
    }catch(e){
        console.log(`Internal error : ${e}`);
        return res.status(500).json({error : "Internal error"});
    }   
};

export const getCompanyJobPosts = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }
    const company_id = parseInt(req.params.companyId, 10);
    const limit : number = req.query.limit ? parseInt(req.query.limit as string) : -1;
    const page : number = req.query.page ? parseInt(req.query.page as string) : 0;
    try {
        const company = await findCompanyById(company_id);
        if(!company){
            return res.status(404).json({error : "company not found"});
        }
        let job_posts;
        if(limit === -1){
            job_posts = await findJobsByCompanyId(company_id);
        }else{
            job_posts = await findJobsByCompanyId(company_id, limit, page-1);
        }

        return res.status(200).json({
            data : {
                posts : job_posts
            }, 
            error : null            
        });
    }catch(e){
        console.log(`Internal error : ${e}`);
        return res.status(500).json({error : "Internal error"});
    }   
};


export const getCompanyAnnouncements = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }
    const company_id = parseInt(req.params.companyId, 10);
    const limit : number = req.query.limit ? parseInt(req.query.limit as string) : -1;
    const page : number = req.query.page ? parseInt(req.query.page as string) : 0;
    try {
        const company = await findCompanyById(company_id);
        if(!company){
            return res.status(404).json({error : "company not found"});
        }
        let company_announcements;
        if(limit === -1){
            company_announcements = await findAnnouncementsByCompanyId(company_id);
        }else{
            company_announcements = await findAnnouncementsByCompanyId(company_id, limit, page-1);
        }

        return res.status(200).json({
            data : {
                announcements : company_announcements
            }, 
            error : null            
        });
    }catch(e){
        console.log(`Internal error : ${e}`);
        return res.status(500).json({error : "Internal error"});
    }   
};

export const getCompanyJobsApplications = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }
    const company_id = parseInt(req.params.companyId, 10);
    const limit : number = req.query.limit ? parseInt(req.query.limit as string) : -1;
    const page : number = req.query.page ? parseInt(req.query.page as string) : 0;
    try{
        const company = await findCompanyById(company_id);
        if(!company){
            return res.status(404).json({error : "company not found"});
        }
        if(company?.created_by !== user_id){
            return res.status(401).json({error : "unauthorized"});
        }
        let job_applications;
        if(limit === -1){
            job_applications = await findJobApplicationsToCompany(company_id);
        }else{
            job_applications = await findJobApplicationsToCompany(company_id, limit, page-1);
        }
        return res.status(200).json({
            error : null,
            data : {
                applications : job_applications
            }
        });
    }catch(e){
        console.log(`Internal error : ${e}`);
        return res.status(500).json({error : "Internal error"});
    }
};

export const updateJobApplicationStatus = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }
    const company_id = parseInt(req.params.comanyId, 10);
    const job_application_id = parseInt(req.params.applicationId, 10);
    const {status} = req.body;
    try{
        const company = await findCompanyById(company_id);
        if(!company){
            return res.status(404).json({error : "company not found"});
        }
        if(company?.created_by !== user_id){
            return res.status(401).json({error : "unauthorized"});
        }
        const new_job_application = await updateJobAppStatus(job_application_id, status as ApplicationStatus);
        if(new_job_application){
            return res.status(200).json({
                error : null,
                data : {
                    application : new_job_application
                }
            });
        }else{
            return res.status(404).json({
                error : "Job application not found"
            });
        }         
    }catch(e){
        console.log(`Internal error : ${e}`);
        return res.status(500).json({error : "Internal error"});
    }
}

export const getCompanyAnalytics = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});       
    }
    const company_id = parseInt(req.params.companyId, 10);
    try{
        const company = await findCompanyById(company_id);
        if(!company){
            return res.status(404).json({error : "company not found"});
        }
        if(company?.created_by !== user_id){
            return res.status(401).json({error : "unauthorized"});
        }
        const job_application_analytics = await findNumberOfJobApplicationsForCompany(company_id);
        const number_of_jobs = await findNumberOfJobPostForCompany(company_id);
        const number_of_followrs = await findNumberOfFollowersOfCompany(company_id);
        const number_of_announcements = await findNumberOfAnnouncements(company_id);
        return res.status(200).json({
            error : null,
            data : {
                analytics : {
                    job_application_analytics : job_application_analytics,
                    number_of_job_posts : number_of_jobs,
                    number_of_followrs : number_of_followrs,
                    number_of_announcements : number_of_announcements
                }
            }
        });
    }catch(e){
        console.log(`Internal error : ${e}`);
        return res.status(500).json({error : "Internal error"});
    }
};

export const followCompany = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }
    const company_id = parseInt(req.params.companyId, 10);
    const {first_name, last_name, profile_photo_url} = req.body;
    try {
        const date = new Date();
        const follow = await createFollowRelationShip(user_id, company_id, date, first_name, last_name, profile_photo_url);
        if(follow){
            return res.status(200).json({
                data : {
                    msg : "Company followed"
                },
                error : null
            });
        }else{
            return res.status(400).json({error : "Company already followed"});
        }
    }catch(e){
        console.log(`Internal error : ${e}`)
        return res.status(500).json({error : "Internal error : "})
    }
}

export const unfollowCompany = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }
    const company_id = parseInt(req.params.companyId, 10);
    try {
        const unfollow = await deleteFollowRelationShip(user_id, company_id);
        if(unfollow){
            return res.status(200).json({
                data : {
                    msg : "Company unfollowed"
                },
                error : null
            });
        }else{
            return res.status(400).json({error : "Company already unfollowed"});
        }
    }catch(e){
        console.log(`Internal error : ${e}`)
        return res.status(500).json({error : "Internal error : "})
    }
}