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
  adminBanUser,
  adminUnbanUser,
  adminGetBannedUsers,
  adminCreateUser,
  adminDeleteUser,
  adminGetUserReports,
  adminDeleteReport,
  reportUser,
  emailExists,
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
router.post("/report-user", authenticateToken, reportUser);

router.post("/ban-user", authenticateToken, adminBanUser);
router.post("/unban-user", authenticateToken, adminUnbanUser);
router.get("/banned", authenticateToken, adminGetBannedUsers);

router.post("/admin-create-user", authenticateToken, adminCreateUser);
router.post("/admin-delete-user", authenticateToken, adminDeleteUser);
router.get("/admin-get-user-reports", authenticateToken, adminGetUserReports);
router.post("/admin-delete-user-report", authenticateToken, adminDeleteReport);

router.get("/exists/:email", emailExists);

export default router;
