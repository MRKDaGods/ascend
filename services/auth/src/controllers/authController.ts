import pool from "@shared/config/db";
import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import { generateToken, verifyToken } from "@shared/utils/jwt";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { checkProxyEmailExists, sendEmail } from "../services/emailService";
import {
  createUser,
  deleteUser,
  findUserByEmail,
  findUserById,
  resetUserPassword,
  updateUserFCMToken,
  updateUserEmail,
  updateUserEmailConfirmation,
  updateUserNewEmailConfirmation,
  updateUserPassword,
  updateUserResetToken,
  getAllUserReports,
  deleteUserReport,
  reportUser as reportUserService,
  resetUserPassword2,
} from "../services/userService";
import { UserRole } from "@shared/models";
import {
  banUser,
  getBannedUsers,
  isUserBanned,
  unbanUser,
} from "../services/banService";

/**
 * Handles user registration process
 *
 * @param req (first_name, last_name, email, password)
 *
 * @returns HTTP response
 * - 201 with user id and email if registration successful
 * - 400 if email already exists
 * - 500 if server error occurs
 *
 * @remarks
 * Confirmation email is valid for 24 hours
 */
export const register = async (req: Request, res: Response) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create user
    const user = await createUser(first_name, last_name, email, password);

    // Send confirmation email
    const confirmation_token = generateToken({ email }, "24h");
    await updateUserEmail(user.id, null, confirmation_token); // Set confirmation token

    await sendEmail(
      email,
      "Confirm Your Email",
      `Welcome to Ascend!\nClick this link to confirm your email: https://api.ascendx.tech/auth/confirm-email?token=${confirmation_token}`
    );

    res.status(201).json({ user_id: user.id, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Handles user login
 *
 * @param req (email, password)
 *
 * @returns JSON response with authentication token and user ID on success
 * @returns 200 status with token and user ID on successful login
 * @returns 401 status with error message for invalid credentials
 * @returns 403 status with error message if email is not verified
 * @returns 500 status with error message on server error
 *
 * @remarks
 * Tokens are valid for 30 days
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.is_verified) {
      return res.status(403).json({ error: "Email not confirmed" });
    }

    if (
      !user.password_hash ||
      !(await bcrypt.compare(password, user.password_hash))
    ) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if the user is banned
    if (await isUserBanned(user.id)) {
      return res.status(401).json({ error: "User is banned" });
    }

    const token = generateToken({ id: user.id }, "30d");
    res.json({ token, user_id: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Handles email confirmation process
 *
 * @param req (token)
 *
 * @returns HTTP response
 * - 200 with success message if email confirmed
 * - 400 if token is invalid or expired
 * - 500 if server error occurs
 */
export const confirmEmail = async (req: Request, res: Response) => {
  const { token } = req.query as { token: string };

  try {
    const { email, isNewEmail } = verifyToken(token);

    let user = isNewEmail
      ? await updateUserNewEmailConfirmation(email, token)
      : await updateUserEmailConfirmation(email, token);
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    if (isNewEmail) {
      await sendEmail(
        email,
        "Welcome to Ascend!",
        `Your new email has been confirmed. Welcome aboard!`
      );
    } else {
      await sendEmail(
        email,
        "Welcome to Ascend!",
        `Your email has been confirmed. Welcome aboard!`
      );
    }

    res.json({ message: "Email confirmed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Resends the confirmation email to the user
 *
 * @param req (email)
 *
 * @returns HTTP response
 * - 200 with success message if email resent
 * - 404 if user not found
 * - 400 if email already confirmed
 * - 500 if server error occurs
 */
export const resendConfirmEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.is_verified) {
      return res.status(400).json({ error: "Email already confirmed" });
    }

    const confirmation_token = generateToken(
      { email, isNewEmail: false },
      "24h"
    );
    await pool.query(
      "UPDATE auth_service.users SET confirmation_token = $1 WHERE email = $2",
      [confirmation_token, email]
    );

    await sendEmail(
      email,
      "Confirm Your Email",
      `Click this link to confirm your email: https://api.ascendx.tech/auth/confirm-email?token=${confirmation_token}`
    );

    res.json({ message: "Confirmation email resent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Initiates the password reset process
 *
 * @param req (email)
 *
 * @returns HTTP response
 * - 200 with success message if reset email sent
 * - 404 if user not found
 * - 500 if server error occurs
 *
 * @remarks
 * Reset email is valid for 1 hour
 */
export const forgetPassword = async (req: Request, res: Response) => {
  const { email, send_code } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Do we need to create a verficiation code for the user?
    let reset_token;
    let reset_msg;
    if (send_code === true) {
      const verification_code = Math.floor(100000 + Math.random() * 900000);
      reset_token = verification_code.toString();
      reset_msg = `Your password verification code is: ${verification_code}`;
    } else {
      reset_token = generateToken({ email }, "1h");
      reset_msg = `Click this link to reset your password: https://www.ascendx.tech/authen/ForgetPassword/new?token=${reset_token}`;
    }

    await updateUserResetToken(email, reset_token);
    await sendEmail(email, "Reset Your Password", reset_msg);

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const checkPasswordResetCode = async (req: Request, res: Response) => {
  const { code, xemail } = req.body;
  try {
    if (code.toString().length !== 6) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    const user = await findUserByEmail(xemail);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.reset_token !== code.toString()) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    res.json({ message: "Verification code is valid" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Resets the user's password
 *
 * @param req (token, new_password)
 *
 * @returns HTTP response
 * - 200 with success message if password reset
 * - 400 if token is invalid or expired
 * - 500 if server error occurs
 */
export const resetPassword = async (req: Request, res: Response) => {
  const { token, code, xemail, new_password } = req.body;

  try {
    if (code) {
      if (code.toString().length !== 6) {
        return res.status(400).json({ error: "Invalid verification code" });
      }

      const u2 = await resetUserPassword2(
        code.toString(),
        xemail,
        new_password
      );
      if (!u2) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }

      res.json({ message: "Password reset successfully" });
      return;
    }

    const { email } = verifyToken(token);
    const user = await resetUserPassword(email, token, new_password);
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Updates the user's password
 *
 * Authentication required
 *
 * @param req (old_password, new_password)
 *
 * @returns HTTP response
 * - 200 with success message if password updated
 * - 401 if old password is invalid or user is not authenticated
 * - 404 if user not found
 * - 500 if server error occurs
 */
export const updatePassword = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { old_password, new_password } = req.body;
  const userId = req.user!.id;

  try {
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (
      !user.password_hash ||
      !(await bcrypt.compare(old_password, user.password_hash))
    ) {
      return res.status(401).json({ error: "Invalid old password" });
    }

    await updateUserPassword(userId, new_password);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Updates the user's email address
 *
 * Authentication required
 *
 * @param req (new_email)
 *
 * @returns HTTP response
 * - 200 with success message if email updated
 * - 400 if email already in use or missing new email
 * - 500 if server error occurs
 *
 * @remarks
 * Confirmation email is valid for 24 hours
 */
export const updateEmail = async (req: AuthenticatedRequest, res: Response) => {
  const { new_email } = req.body;
  const userId = req.user!.id;

  if (!new_email) {
    return res.status(400).json({ error: "Missing new email" });
  }

  try {
    const existingUser = await findUserByEmail(new_email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const confirmation_token = generateToken(
      { email: new_email, isNewEmail: true },
      "24h"
    );
    await updateUserEmail(userId, new_email, confirmation_token);

    await sendEmail(
      new_email,
      "Confirm Your New Email",
      `Click this link to confirm your new email: https://api.ascendx.tech/auth/confirm-email?token=${confirmation_token}`
    );

    res.json({ message: "Confirmation email sent to new email address" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Handles social login using Google OAuth
 *
 * @param req (token)
 *
 * @returns JSON response with authentication token and user ID on success
 * @returns 401 status with error message for invalid Google token
 * @returns 400 status with error message for missing fields
 * @returns 500 status with error message on server error
 */
export const socialLogin = async (req: Request, res: Response) => {
  const { token, userData } = req.body;

  console.log(`[SOCIAL] Received token: ${token}`);
  console.log(`[SOCIAL] Received user data:`, userData);

  try {
    // For Firebase Auth, we can extract user info directly from the decoded token sent by the client
    if (!userData || !userData.email) {
      return res.status(401).json({ error: "Invalid authentication data" });
    }

    const firstName = userData.given_name || userData.displayName?.split(' ')[0] || 'User';
    const lastName = userData.family_name || userData.displayName?.split(' ').slice(1).join(' ') || '';
    const email = userData.email;

    if (!email) {
      return res.status(400).json({ error: "Missing required email field" });
    }

    // Create an already verified user if they don't exist
    let user = await findUserByEmail(email);
    if (!user) {
      console.log(`[SOCIAL] Creating new user: ${email}`);
      user = await createUser(firstName, lastName, email, undefined, true);
    }

    console.log(`[SOCIAL] User found: ${JSON.stringify(user)}`);

    const jwtToken = generateToken({ id: user.id });
    res.json({ token: jwtToken, user_id: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Deletes the user's account
 *
 * Authentication required
 *
 * @returns HTTP response
 * - 200 with success message if account deleted
 * - 404 if user not found
 * - 500 if server error occurs
 */
export const deleteAccount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user!.id;

  try {
    if (!(await findUserById(userId))) {
      return res.status(404).json({ error: "User not found" });
    }

    await deleteUser(userId);
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Sets the user FCM token
 *
 * Authentication required
 *
 * @returns HTTP response
 * - 200 with success message if account deleted
 * - 404 if user not found
 * - 500 if server error occurs
 */
export const updateFCMToken = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { fcm_token } = req.body;
  const userId = req.user!.id;

  try {
    if (!(await findUserById(userId))) {
      return res.status(404).json({ error: "User not found" });
    }

    // TODO: Validate token by dry running

    await updateUserFCMToken(userId, fcm_token);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const reportUser = async (req: AuthenticatedRequest, res: Response) => {
  const { user_id, reason } = req.body;
  const reporterId = req.user!.id;

  try {
    if (!(await findUserById(user_id))) {
      return res.status(404).json({ error: "User not found" });
    }

    if (reporterId === user_id) {
      return res.status(400).json({ error: "Cannot report yourself" });
    }

    await reportUserService(user_id, reporterId, reason);
    res.json({ message: "User reported successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const adminBanUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const bannedById = req.user!.id;

  try {
    // Verify if the user is an admin
    const user = await findUserById(bannedById);
    if (!user || user.role !== UserRole.ADMIN) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { user_id, expires_at, reason } = req.body;

    if (!(await findUserById(user_id))) {
      return res.status(404).json({ error: "User not found" });
    }

    await banUser(user_id, bannedById, expires_at, reason);

    res.json({ message: "User banned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

export const adminUnbanUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const bannedById = req.user!.id;

  try {
    // Verify if the user is an admin
    const user = await findUserById(bannedById);
    if (!user || user.role !== UserRole.ADMIN) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { user_id } = req.body;

    if (!(await findUserById(user_id))) {
      return res.status(404).json({ error: "User not found" });
    }

    await unbanUser(user_id);

    res.json({ message: "User unbanned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

export const adminGetBannedUsers = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const bannedById = req.user!.id;

  try {
    // Verify if the user is an admin
    const user = await findUserById(bannedById);
    if (!user || user.role !== UserRole.ADMIN) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const bannedUsers = await getBannedUsers();
    res.json(bannedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

export const adminCreateUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const adminId = req.user!.id;
  const { first_name, last_name, email, password } = req.body;

  try {
    // Verify if the user is an admin
    const user = await findUserById(adminId);
    if (!user || user.role !== UserRole.ADMIN) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const createdUser = await createUser(
      first_name,
      last_name,
      email,
      password,
      true
    );
    res.status(201).json({ user_id: createdUser.id, email: createdUser.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

export const adminDeleteUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const adminId = req.user!.id;
  const { user_id } = req.body;

  try {
    // Verify if the user is an admin
    const user = await findUserById(adminId);
    if (!user || user.role !== UserRole.ADMIN) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (!(await findUserById(user_id))) {
      return res.status(404).json({ error: "User not found" });
    }

    await deleteUser(user_id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

export const adminGetUserReports = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const adminId = req.user!.id;

  try {
    // Verify if the user is an admin
    const user = await findUserById(adminId);
    if (!user || user.role !== UserRole.ADMIN) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const reports = await getAllUserReports();
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

export const adminDeleteReport = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const adminId = req.user!.id;
  const { report_id } = req.body;

  try {
    // Verify if the user is an admin
    const user = await findUserById(adminId);
    if (!user || user.role !== UserRole.ADMIN) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await deleteUserReport(report_id);
    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

export const emailExists = async (req: Request, res: Response) => {
  const { email } = req.params;
  try {
    // email MUST exist in our database
    if (!(await checkProxyEmailExists(email))) {
      return res.status(400).json({
        error: "Please create an email first at www.ascendx.tech/email",
      });
    }

    const user = await findUserByEmail(email);
    res.json({ exists: user != null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
