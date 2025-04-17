import authenticateToken from "@shared/middleware/authMiddleware";
import { Router } from "express";
import {
  confirmEmail,
  deleteAccount,
  forgetPassword,
  login,
  register,
  resendConfirmEmail,
  resetPassword,
  updateFCMToken,
  socialLogin,
  updateEmail,
  updatePassword,
} from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/confirm-email", confirmEmail);
router.post("/resend-confirm", resendConfirmEmail);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.put("/update-password", authenticateToken, updatePassword);
router.put("/update-email", authenticateToken, updateEmail);
router.post("/social-login", socialLogin);
router.delete("/delete-account", authenticateToken, deleteAccount);
router.post("/fcm-token", authenticateToken, updateFCMToken);

export default router;
