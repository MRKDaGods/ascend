import { Router } from "express";
import { createAnnounementPost, createCompanyProfile, createJobPost, deleteAnnouncementPost, deleteCompanyProfile, deleteJobPost, followCompany, getAnnouncement, getCompaniesCreatedByUser, getCompanyAnalytics, getCompanyAnnouncements, getCompanyFollowers, getCompanyJobPosts, getCompanyJobsApplications, getCompanyProfile, getJobPost, unfollowCompany, updateCompany, updateJobApplicationStatus } from "../controllers/companyController";
import authenticateToken from "@shared/middleware/authMiddleware";
import { announcementIdValidation, applicationIdValidation, companyIdValidation, createAnnouncementValidation, createCompanyValidation, createJobValidation, followValidation, jobIdValidation, limitAndPageValidation, updateCompanyValidation, updateJobApplicationValidation } from "../validations/companyValidation";
const companyRoutes = Router();


companyRoutes.post("/api/companies", authenticateToken, createCompanyValidation, createCompanyProfile);
companyRoutes.patch("/api/companies/:companyId", authenticateToken, companyIdValidation, updateCompanyValidation, updateCompany);
companyRoutes.get("/api/companies/:companyId", authenticateToken, companyIdValidation, getCompanyProfile);
companyRoutes.get("/api/companies", authenticateToken, getCompaniesCreatedByUser);
companyRoutes.delete("/api/companies/:companyId", authenticateToken, companyIdValidation, deleteCompanyProfile);

companyRoutes.post("/api/companies/:companyId/jobs", authenticateToken, companyIdValidation, createJobValidation, createJobPost);
companyRoutes.get("/api/companies/:companyId/jobs", authenticateToken, companyIdValidation, limitAndPageValidation, getCompanyJobPosts);
companyRoutes.delete("/api/companies/:companyId/jobs/:jobId", authenticateToken, companyIdValidation, jobIdValidation, deleteJobPost);
companyRoutes.get("/api/companies/jobs/:jobId", authenticateToken, jobIdValidation, getJobPost);

companyRoutes.post("/api/companies/:companyId/announcements", authenticateToken, companyIdValidation, createAnnouncementValidation, createAnnounementPost);
companyRoutes.get("/api/companies/:companyId/announcements", authenticateToken, companyIdValidation, limitAndPageValidation, getCompanyAnnouncements);
companyRoutes.delete("/api/companies/:companyId/announcements/:announcementId", authenticateToken, companyIdValidation, announcementIdValidation, deleteAnnouncementPost);
companyRoutes.get("/api/companies/announcements/:announcementId", authenticateToken, announcementIdValidation, getAnnouncement);

companyRoutes.get("/api/companies/:companyId/applications", authenticateToken, companyIdValidation, limitAndPageValidation, getCompanyJobsApplications);
companyRoutes.patch("/api/companies/:companyId/applications/:applicationId", authenticateToken, companyIdValidation, applicationIdValidation, updateJobApplicationValidation, updateJobApplicationStatus);

companyRoutes.get("/api/companies/:companyId/followers", authenticateToken, companyIdValidation, limitAndPageValidation, getCompanyFollowers);

companyRoutes.post("/api/companies/:companyId/follow", authenticateToken, companyIdValidation, followValidation, followCompany);
companyRoutes.delete("/api/companies/:companyId/unfollow", authenticateToken, companyIdValidation, unfollowCompany);

companyRoutes.get("/api/companies/:companyId/analytics", authenticateToken, companyIdValidation, getCompanyAnalytics);

export default companyRoutes;