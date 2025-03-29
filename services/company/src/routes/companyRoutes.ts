import { Router } from "express";
import { createAnnounementPost, createCompanyProfile, createJobPost, deleteAnnouncementPost, deleteCompanyProfile, deleteJobPost, followCompany, getAnnouncement, getCompaniesCreatedByUser, getCompanyAnalytics, getCompanyAnnouncements, getCompanyFollowers, getCompanyJobPosts, getCompanyJobsApplications, getCompanyProfile, getJobPost, unfollowCompany, updateCompany, updateJobApplicationStatus } from "../controllers/companyController";
import authenticateToken from "@shared/middleware/authMiddleware";
import { updateCompanyProfile } from "../services/companyService";

const companyRoutes = Router();


companyRoutes.post("/companies", authenticateToken, createCompanyProfile);
companyRoutes.patch("/companies/:companyId", authenticateToken, updateCompany);
companyRoutes.get("/companies/:companyId", authenticateToken, getCompanyProfile);
companyRoutes.get("/companies", authenticateToken, getCompaniesCreatedByUser);
companyRoutes.delete("/companies/:companyId", authenticateToken, deleteCompanyProfile);

companyRoutes.post("/companies/:companyId/jobs", authenticateToken, createJobPost);
companyRoutes.get("/companies/:companyId/jobs", authenticateToken, getCompanyJobPosts);
companyRoutes.delete("/companies/:companyId/jobs/:jobId", authenticateToken, deleteJobPost);
companyRoutes.get("/companies/jobs/:jobId", authenticateToken, getJobPost);

companyRoutes.post("/companies/:companyId/announcements", authenticateToken, createAnnounementPost);
companyRoutes.get("/companies/:companyId/announcements", authenticateToken, getCompanyAnnouncements);
companyRoutes.delete("/companies/:companyId/announcements/:announcementId", authenticateToken, deleteAnnouncementPost);
companyRoutes.get("/companies/announcements/:announcementId", authenticateToken, getAnnouncement);

companyRoutes.get("/companies/:companyId/applications", authenticateToken, getCompanyJobsApplications);
companyRoutes.patch("/companies/:companyId/applications/:applicationId", authenticateToken, updateJobApplicationStatus);

companyRoutes.get("/companies/:companyId/followers", authenticateToken, getCompanyFollowers);

companyRoutes.post("/companies/:companyId/follow", authenticateToken, followCompany);
companyRoutes.delete("/companies/:companyId/unfollow", authenticateToken, unfollowCompany);

companyRoutes.get("/companies/:companyId/analytics", authenticateToken, getCompanyAnalytics);

export default companyRoutes;