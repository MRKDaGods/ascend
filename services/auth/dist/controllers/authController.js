"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFCMToken = exports.deleteAccount = exports.socialLogin = exports.updateEmail = exports.updatePassword = exports.resetPassword = exports.forgetPassword = exports.resendConfirmEmail = exports.confirmEmail = exports.login = exports.register = void 0;
const db_1 = __importDefault(require("@shared/config/db"));
const jwt_1 = require("@shared/utils/jwt");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const emailService_1 = require("../services/emailService");
const googleAuthService_1 = require("../services/googleAuthService");
const userService_1 = require("../services/userService");
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
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, email, password } = req.body;
    try {
        const existingUser = yield (0, userService_1.findUserByEmail)(email);
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }
        // Create user
        const user = yield (0, userService_1.createUser)(first_name, last_name, email, password);
        // Send confirmation email
        const confirmation_token = (0, jwt_1.generateToken)({ email }, "24h");
        yield (0, userService_1.updateUserEmail)(user.id, null, confirmation_token); // Set confirmation token
        yield (0, emailService_1.sendEmail)(email, "Confirm Your Email", `Click this link to confirm your email: http://localhost:3001/confirm-email?token=${confirmation_token}`);
        res.status(201).json({ user_id: user.id, email: user.email });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.register = register;
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
 * Tokens are valid for 12 hours
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield (0, userService_1.findUserByEmail)(email);
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        if (!user.is_verified) {
            return res.status(403).json({ error: "Email not confirmed" });
        }
        if (!user.password_hash ||
            !(yield bcryptjs_1.default.compare(password, user.password_hash))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = (0, jwt_1.generateToken)({ id: user.id }, "12h"); // 12h expiration
        res.json({ token, user_id: user.id });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.login = login;
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
const confirmEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.query;
    try {
        const { email, isNewEmail } = (0, jwt_1.verifyToken)(token);
        let user = isNewEmail
            ? yield (0, userService_1.updateUserNewEmailConfirmation)(email, token)
            : yield (0, userService_1.updateUserEmailConfirmation)(email, token);
        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }
        res.json({ message: "Email confirmed successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.confirmEmail = confirmEmail;
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
const resendConfirmEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield (0, userService_1.findUserByEmail)(email);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.is_verified) {
            return res.status(400).json({ error: "Email already confirmed" });
        }
        const confirmation_token = (0, jwt_1.generateToken)({ email, isNewEmail: false }, "24h");
        yield db_1.default.query("UPDATE auth_service.users SET confirmation_token = $1 WHERE email = $2", [confirmation_token, email]);
        yield (0, emailService_1.sendEmail)(email, "Confirm Your Email", `Click this link to confirm your email: http://localhost:3001/confirm-email?token=${confirmation_token}`);
        res.json({ message: "Confirmation email resent" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.resendConfirmEmail = resendConfirmEmail;
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
const forgetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield (0, userService_1.findUserByEmail)(email);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const reset_token = (0, jwt_1.generateToken)({ email }, "1h");
        yield (0, userService_1.updateUserResetToken)(email, reset_token);
        yield (0, emailService_1.sendEmail)(email, "Reset Your Password", `Click this link to reset your password: http://localhost:3001/auth/reset-password?token=${reset_token}`);
        res.json({ message: "Password reset email sent" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.forgetPassword = forgetPassword;
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
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, new_password } = req.body;
    try {
        const { email } = (0, jwt_1.verifyToken)(token);
        const user = yield (0, userService_1.resetUserPassword)(email, token, new_password);
        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }
        res.json({ message: "Password reset successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.resetPassword = resetPassword;
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
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { old_password, new_password } = req.body;
    const userId = req.user.id;
    try {
        const user = yield (0, userService_1.findUserById)(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (!user.password_hash ||
            !(yield bcryptjs_1.default.compare(old_password, user.password_hash))) {
            return res.status(401).json({ error: "Invalid old password" });
        }
        yield (0, userService_1.updateUserPassword)(userId, new_password);
        res.json({ message: "Password updated successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.updatePassword = updatePassword;
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
const updateEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { new_email } = req.body;
    const userId = req.user.id;
    if (!new_email) {
        return res.status(400).json({ error: "Missing new email" });
    }
    try {
        const existingUser = yield (0, userService_1.findUserByEmail)(new_email);
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }
        const confirmation_token = (0, jwt_1.generateToken)({ email: new_email, isNewEmail: true }, "24h");
        yield (0, userService_1.updateUserEmail)(userId, new_email, confirmation_token);
        yield (0, emailService_1.sendEmail)(new_email, "Confirm Your New Email", `Click this link to confirm your new email: http://localhost:3001/auth/confirm-email?token=${confirmation_token}`);
        res.json({ message: "Confirmation email sent to new email address" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.updateEmail = updateEmail;
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
const socialLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    console.log(`[SOCIAL] Received token: ${token}`);
    try {
        const payload = yield (0, googleAuthService_1.verifyGoogleToken)(token);
        console.log(`[SOCIAL] Decoded payload: ${JSON.stringify(payload)}`);
        if (!payload) {
            return res.status(401).json({ error: "Invalid Google token" });
        }
        const firstName = payload.given_name;
        const lastName = payload.family_name;
        const email = payload.email;
        if (!firstName || !lastName || !email) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        // Create an already verified user if they don't exist
        let user = yield (0, userService_1.findUserByEmail)(email);
        if (!user) {
            console.log(`[SOCIAL] Creating new user: ${email}`);
            user = yield (0, userService_1.createUser)(firstName, lastName, email, undefined, true);
        }
        console.log(`[SOCIAL] User found: ${JSON.stringify(user)}`);
        const jwtToken = (0, jwt_1.generateToken)({ id: user.id });
        res.json({ token: jwtToken, userId: user.id });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.socialLogin = socialLogin;
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
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        if (!(yield (0, userService_1.findUserById)(userId))) {
            return res.status(404).json({ error: "User not found" });
        }
        yield (0, userService_1.deleteUser)(userId);
        res.json({ message: "Account deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.deleteAccount = deleteAccount;
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
const updateFCMToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fcm_token } = req.body;
    const userId = req.user.id;
    try {
        if (!(yield (0, userService_1.findUserById)(userId))) {
            return res.status(404).json({ error: "User not found" });
        }
        // TODO: Validate token by dry running
        yield (0, userService_1.updateUserFCMToken)(userId, fcm_token);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.updateFCMToken = updateFCMToken;
