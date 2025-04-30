import authenticateEmailToken from "@shared/middleware/emailAuthMiddleware";
import { Router } from "express";
import {
  createEmail,
  deleteEmail,
  getEmails,
  login,
  sendEmail,
} from "../controllers/emailController";

const router = Router();

router.post("/register", createEmail);
router.post("/send-email", authenticateEmailToken, sendEmail);
router.get("/get-emails", authenticateEmailToken, getEmails);
router.post("/login", login);
router.delete("/delete-email/:emailId", authenticateEmailToken, deleteEmail);

export default router;
