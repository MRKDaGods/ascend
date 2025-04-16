import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import { Response } from "express";
import { createCompany, deleteCompany, findCompaniesCreatedByUser, findCompanyById, updateCompanyProfile } from "../services/companyService";
import { createFollowRelationShip, deleteFollowRelationShip, findFollowersOfCompany, findNumberOfFollowersOfCompany } from "../services/followsService";
import { createAnnouncement, deleteAnnouncement, findAnnouncementById, findAnnouncementsByCompanyId, findNumberOfAnnouncements } from "../services/announcementService";
import { Company } from "@shared/models/company";
import { validationResult } from "express-validator";
import { error } from "console";

/**
 * @route POST /api/companies
 * @description create a new company profile
 * @param {AuthenticatedRequest} req (name , description, logoUrl, location. industry, date) - AuthenticatedRequest object (comming from authorization middleware)
 * @returns {Response} - HTTP response
 * - 200 with new company profile
 * - 404 if the request parameters and/or body are not in the required format
 * - 500 if internal error occurs
 */
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
};

/**
 * @route DELETE /api/companies/:companyId
 * @description delete existing company profile
 * @param {AuthenticatedRequest} req - AuthenticatedRequest object (comming from authorization middleware)
 * @param companyId - path parameter
 * @returns {Response} - HTTP Response
 * - 401 if the user who sent the request is not authorized or is not the creator of the company profile
 * - 404 if no company with the given ID was found or the request parameters and/or body are not in the required format
 * - 200 with message indicating success of deleting the company profile
 * - 500 if internal errors occur
 */
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


/**
 * @route GET /api/companies
 * @description get all company profiles created by the user with given ID
 * @param {AuthenticatedRequest} req - AuthenticatedRequest object (coming from authorization middleware)
 * @returns {Response} - HTTP Response
 * - 401 if the user who sent the request is not authorized
 * - 404 if the request parameters and/or body are not in the required format
 * - 200 with array of company profiles created by the user with the given ID
 * - 500 if internal errors occur
 */
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


/**
 * @route PATCH /api/companies/:companyId
 * @description update existing company profile
 * @param {AuthenticatedRequest} req - AuthenticatedRequest object (comming from authorization middleware)
 * @param comanyId - path parameter
 * @returns {Response} - HTTP Response
 * - 401 if the user who sent the request is not authorized or is not the creator of the company profile
 * - 404 if no company with the given ID was found or the request parameters and/or body are not in the required format
 * - 200 with the updated company profile
 * - 500 if internal errors occur
 */
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


/**
 * @route GET /api/companies/:companyId
 * @description get the company profile with the given ID
 * @param {AuthenticatedRequest} req - AuthenticatedRequest object (comming from authorization middleware)
 * @param companyId - path parameter
 * @returns {Response} - HTTP Response
 * - 401 if the user who sent the request is not authorized or is not the creator of the company
 * - 404 if no company with the given ID was found or the request parameters and/or body are not in the required format
 * - 200 with the company profile
 * - 500 if internal errors occur
 */
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
    }catch(e : any){
        console.log(`Internal error : ${e}`)
        return res.status(500).json({error : "Internal error"});
    }
};



/**
 * @route POST /api/companies/:companyId/announcements
 * @description create a new announcement post for the company with the given ID
 * @param {AuthenticatedRequest} req - AuthenticatedRequest object (comming from authorization middleware)
 * @param comanyId - path parameter
 * @returns {Response} - HTTP Response
 * - 401 if the user who sent the request is not authorized 
 * - 403 if the user is not the creator of the company
 * - 404 if no company with the given ID was found 
 * - 400 if the request parameters and/or body are not in the required format
 * - 200 with the new announecment post
 * - 500 if internal errors occur
 */
export const createAnnounementPost = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()});
    }

    const company_id = parseInt(req.params.companyId, 10);
    const { content } = req.body;
    try {
        const company = await findCompanyById(company_id);
        if(!company){
            return res.status(404).json({error : "company not found"});
        }
        if(company?.created_by !== user_id){
            return res.status(403).json({error : "forbidden"});
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



/**
 * @route DELETE /api/companies/:companyId/announcements/:announcementId
 * @description delete the announcement post for the company with the given ID
 * @param {AuthenticatedRequest} req - AuthenticatedRequest object (comming from authorization middleware)
 * @param companyId - path parameter
 * @param announcementId - path parameter
 * @returns {Response} - HTTP Response
 * - 401 if the user who sent the request is not authorized 
 * - 403 if the user is not the creator of the company
 * - 404 if no company profile with the given ID was found or no announcement post with given ID was found 
 * - 400 if the request parameters and/or body are not in the required format
 * - 200 with message indicating success of announcement post deletion
 * - 500 if internal errors occur
 */
export const deleteAnnouncementPost = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()});
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
            return res.status(403).json({error : "forbidden"});
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
            return res.status(404).json({error : "announcement not found"});
        }
    }catch(e){
        console.log(`Internal error : ${e}`)
        return res.status(500).json({error : "Internal error"});
    }
};



/**
 * @route GET /api/companies/announcements/:announcementId
 * @description get job post with the given ID
 * @param {AuthenticatedRequest} req - AuthenticatedRequest object (comming from authorization middleware)
 * @param announcementId - path parameter
 * @returns {Response} - HTTP Response
 * - 401 if the user who sent the request is not authorized
 * - 404 if no announcement post with the given ID was found 
 * - 400 if the request parameters and/or body are not in the required format
 * - 200 with the announcement post
 * - 500 if internal errors occur
 */
export const getAnnouncement = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()});
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
            return res.status(404).json({error : "announcement not found"});
        }
    }catch(e){
        console.log(`Internal error : ${e}`);
        return res.status(500).json({error : "Internal error"});
    }
};


/**
 * @route GET /api/companies/:companyId/followers
 * @description get all user profiles following the company with the given ID
 * @param {AuthenticatedRequest} req - AuthenticatedRequest object (comming from authorization middleware)
 * @param comanyId - path parameter
 * @param limit - query parameter indicating the length of the retrieved page
 * @param page - query parameter indicating the number of the page to be returned , starting from 1
 * @returns {Response} - HTTP Response
 * - 401 if the user who sent the request is not authorized 
 * - 403 if the user is not the creator of the company
 * - 404 if the company with given ID was not found 
 * - 400 if the request parameters and/or body are not in the required format
 * - 200 with array of user profiles following the company with the given ID
 * - 500 if internal errors occur
 */
export const getCompanyFollowers = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()});
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
            return res.status(403).json({error : "forbidden"});
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


/**
 * @route GET /api/companies/:companyId/announcements
 * @description get all announcement posts of the company with the given ID
 * @param {AuthenticatedRequest} req - AuthenticatedRequest object (coming from authorization middleware)
 * @param comanyId - path parameter
 * @param limit - query parameter indicating the length of the retrieved page
 * @param page - query parameter indicating the number of the page to be returned , starting from 1
 * @returns {Response} - HTTP Response
 * - 401 if the user who sent the request is not authorized
 * - 404 if the company with given ID was not found 
 * - 400 if the request parameters and/or body are not in the required format
 * - 200 with array of announcement posts of the company with the given ID
 * - 500 if internal errors occur
 */
export const getCompanyAnnouncements = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }


    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()});
    }

    const company_id = parseInt(req.params.companyId, 10);
    const limit : number = req.query.limit ? parseInt(req.query.limit as string) : -1;
    const page : number = req.query.page ? parseInt(req.query.page as string) : 0;
    try {
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
    }catch(e : any){
        if(e.code === "23503"){
            return res.status(404).json({error : "company not found"});
        }
        console.log(`Internal error : ${e}`);
        return res.status(500).json({error : "Internal error"});
    }   
};


/**
 * @route GET /api/companies/:companyId/analytics
 * @description get analytics of the company with the given ID
 * @param {AuthenticatedRequest} req - AuthenticatedRequest object (coming from authorization middleware)
 * @param comanyId - path parameter
 * @returns {Response} - HTTP Response
 * - 401 if the user who sent the request is not authorized
 * - 403 if the user is not the creator of the company
 * - 404 if the company with given ID was not found 
 * - 400 if the request parameters and/or body are not in the required format
 * - 200 with analytics of the company with the given ID in this format
 *   {
 *      job_application_analytics : {pending : # of pending, viewed : # of pending , accepted : # of pending, rejected : # of pending },
 *      number_of_job_posts : # of job posts,
 *      number_of_followers : # of follower,
 *      number_of_announcements : # of announcements
 *   } 
 * - 500 if internal errors occur
 */
export const getCompanyAnalytics = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});       
    }
 
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()});
    }

    const company_id = parseInt(req.params.companyId, 10);
    try{
        const company = await findCompanyById(company_id);
        if(!company){
            return res.status(404).json({error : "company not found"});
        }
        if(company?.created_by !== user_id){
            return res.status(403).json({error : "forbidden"});
        }
        const job_application_analytics = 0; // get from job services
        const number_of_jobs = 0; // get from job service
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


/**
 * @route POST /api/companies/:companyId/follow
 * @description make user with the given user id follow the company with the given ID
 * @param {AuthenticatedRequest} req - AuthenticatedRequest object (comming from authorization middleware)
 * @param comanyId - path parameter
 * @returns {Response} - HTTP Response
 * - 401 if the user who sent the request is not authorized
 * - 404 if no company with the given ID was not found 
 * - 400 if the request parameters and/or body are not in the required format or the company is already followed
 * - 200 with a message indicating that the company is now followed by the user
 * - 500 if internal errors occur
 */
export const followCompany = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()});
    }

    const company_id = parseInt(req.params.companyId, 10);
    try {
        const date = new Date();
        const follow = await createFollowRelationShip(user_id, company_id, date);
        if(follow){
            return res.status(200).json({
                data : {
                    msg : "company followed"
                },
                error : null
            });
        }else{
            return res.status(400).json({error : "company already followed"});
        }
    }catch(e : any){
        if(e.code === "23503"){
            return res.status(404).json({error : "company not found"});
        }
        console.log(`Internal error : ${e}`)
        return res.status(500).json({error : "Internal error : "})
    }
}



/**
 * @route DELETE /api/companies/:companyId/unfollow
 * @description make user with the given user id unfollow the company with the given ID
 * @param {AuthenticatedRequest} req - AuthenticatedRequest object (comming from authorization middleware)
 * @param comanyId - path parameter
 * @returns {Response} - HTTP Response
 * - 401 if the user who sent the request is not authorized
 * - 404 if no company with the given ID was found or the request parameters and/or body are not in the required format
 * - 200 with a message indicating that the user successfully unfollowed the company
 * - 500 if internal errors occur
 */
export const unfollowCompany = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()});
    }

    const company_id = parseInt(req.params.companyId, 10);
    try {
        const unfollow = await deleteFollowRelationShip(user_id, company_id);
        if(unfollow){
            return res.status(200).json({
                data : {
                    msg : "company unfollowed"
                },
                error : null
            });
        }else{
            return res.status(400).json({error : "company already unfollowed"});
        }
    }catch(e : any){
        if(e.code === "23503"){
            return res.status(404).json({error : "company not found"});
        }
        console.log(`Internal error : ${e}`)
        return res.status(500).json({error : "Internal error : "})
    }
}