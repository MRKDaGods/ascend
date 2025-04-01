import { Router } from "express";
import { createAnnounementPost, createCompanyProfile, createJobPost, deleteAnnouncementPost, deleteCompanyProfile, deleteJobPost, followCompany, getAnnouncement, getCompaniesCreatedByUser, getCompanyAnalytics, getCompanyAnnouncements, getCompanyFollowers, getCompanyJobPosts, getCompanyJobsApplications, getCompanyProfile, getJobPost, unfollowCompany, updateCompany, updateJobApplicationStatus } from "../controllers/companyController";
import authenticateToken from "@shared/middleware/authMiddleware";
import { announcementIdValidation, applicationIdValidation, companyIdValidation, createAnnouncementValidation, createCompanyValidation, createJobValidation, followValidation, jobIdValidation, limitAndPageValidation, updateCompanyValidation, updateJobApplicationValidation } from "../validations/companyValidation";
const companyRoutes = Router();


companyRoutes.post("/companies", authenticateToken, createCompanyValidation, createCompanyProfile);
companyRoutes.patch("/companies/:companyId", authenticateToken, companyIdValidation, updateCompanyValidation, updateCompany);
companyRoutes.get("/companies/:companyId", authenticateToken, companyIdValidation, getCompanyProfile);
companyRoutes.get("/companies", authenticateToken, getCompaniesCreatedByUser);
companyRoutes.delete("/companies/:companyId", authenticateToken, companyIdValidation, deleteCompanyProfile);

companyRoutes.post("/companies/:companyId/jobs", authenticateToken, companyIdValidation, createJobValidation, createJobPost);
companyRoutes.get("/companies/:companyId/jobs", authenticateToken, companyIdValidation, limitAndPageValidation, getCompanyJobPosts);
companyRoutes.delete("/companies/:companyId/jobs/:jobId", authenticateToken, companyIdValidation, jobIdValidation, deleteJobPost);
companyRoutes.get("/companies/jobs/:jobId", authenticateToken, jobIdValidation, getJobPost);

companyRoutes.post("/companies/:companyId/announcements", authenticateToken, companyIdValidation, createAnnouncementValidation, createAnnounementPost);
companyRoutes.get("/companies/:companyId/announcements", authenticateToken, companyIdValidation, limitAndPageValidation, getCompanyAnnouncements);
companyRoutes.delete("/companies/:companyId/announcements/:announcementId", authenticateToken, companyIdValidation, announcementIdValidation, deleteAnnouncementPost);
companyRoutes.get("/companies/announcements/:announcementId", authenticateToken, announcementIdValidation, getAnnouncement);

companyRoutes.get("/companies/:companyId/applications", authenticateToken, companyIdValidation, limitAndPageValidation, getCompanyJobsApplications);
companyRoutes.patch("/companies/:companyId/applications/:applicationId", authenticateToken, companyIdValidation, applicationIdValidation, updateJobApplicationValidation, updateJobApplicationStatus);

companyRoutes.get("/companies/:companyId/followers", authenticateToken, companyIdValidation, limitAndPageValidation, getCompanyFollowers);

companyRoutes.post("/companies/:companyId/follow", authenticateToken, companyIdValidation, followValidation, followCompany);
companyRoutes.delete("/companies/:companyId/unfollow", authenticateToken, companyIdValidation, unfollowCompany);

companyRoutes.get("/companies/:companyId/analytics", authenticateToken, companyIdValidation, getCompanyAnalytics);

export default companyRoutes;