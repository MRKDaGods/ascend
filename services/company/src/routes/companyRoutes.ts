import authenticateToken from "@shared/middleware/authMiddleware";
import { Router } from "express";

const companyRoutes = Router();


companyRoutes.post("/companies", () => {});
companyRoutes.put("/companies/:companiesId", () => {});
companyRoutes.post("/companies/:companiesId/jobs", () => {});
companyRoutes.get("/companies/:companiesId/followers", () => {});
companyRoutes.post("/companies/:companiesId/follow", () => {});
companyRoutes.delete("/companies/:companiesId/unfollow", () => {});

export default companyRoutes;