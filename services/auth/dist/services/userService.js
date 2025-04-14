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
exports.getAdminUserId = exports.createAdminUser = exports.getUserFCMToken = exports.updateUserFCMToken = exports.deleteUser = exports.updateUserEmail = exports.updateUserPassword = exports.resetUserPassword = exports.updateUserResetToken = exports.updateUserNewEmailConfirmation = exports.updateUserEmailConfirmation = exports.createUser = exports.findUserById = exports.findUserByEmail = void 0;
const db_1 = __importDefault(require("@shared/config/db"));
const models_1 = require("@shared/models");
const rabbitMQ_1 = require("@shared/rabbitMQ");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Finds a user by their email address
 *
 * @param email - The email address of the user to find
 * @returns A Promise that resolves to the User object if found, or null if no user was found
 */
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query("SELECT * FROM auth_service.users WHERE email = $1", [email]);
    return result.rows.length > 0 ? result.rows[0] : null;
});
exports.findUserByEmail = findUserByEmail;
/**
 * Finds a user by their unique identifier
 *
 * @param id - The unique identifier of the user to find
 * @returns A Promise that resolves to the User object if found, or null if no user was found
 */
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query("SELECT * FROM auth_service.users WHERE id = $1", [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
});
exports.findUserById = findUserById;
/**
 * Creates a new user record in the database
 * and publishes the user created event to RabbitMQ
 * so that the user service may create a user profile.
 *
 * @returns The newly created user record
 * @remarks Password is optional if it's a social login
 */
const createUser = (firstName_1, lastName_1, email_1, password_1, ...args_1) => __awaiter(void 0, [firstName_1, lastName_1, email_1, password_1, ...args_1], void 0, function* (firstName, lastName, email, password, isVerified = false, role = models_1.UserRole.USER) {
    const password_hash = password ? yield bcryptjs_1.default.hash(password, 10) : "";
    const result = yield db_1.default.query("INSERT INTO auth_service.users (email, password_hash, is_verified, role) VALUES ($1, $2, $3, $4) RETURNING *", [email, password_hash, isVerified, role]);
    const user = result.rows[0];
    // Publish user created event, and have the user service create a user profile
    try {
        // UserCreatedPayload
        yield (0, rabbitMQ_1.publishEvent)(rabbitMQ_1.Events.USER_CREATED, {
            user_id: user.id,
            first_name: firstName,
            last_name: lastName,
            email,
        });
    }
    catch (error) {
        console.error("Failed to publish user created event:", error);
    }
    return result.rows[0];
});
exports.createUser = createUser;
/**
 * Updates a user's email confirmation status in the database
 *
 * @param email - The email address of the user to confirm
 * @param token - The confirmation token to validate against the stored token
 * @returns The updated user record if successful, null if no matching user was found or token was invalid
 */
const updateUserEmailConfirmation = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query("UPDATE auth_service.users SET is_verified = true, confirmation_token = NULL WHERE email = $1 AND confirmation_token = $2 RETURNING *", [email, token]);
    return result.rows.length > 0 ? result.rows[0] : null;
});
exports.updateUserEmailConfirmation = updateUserEmailConfirmation;
/**
 * Updates a user's new email address and confirmation token in the database.
 *
 * @param newEmail - The new email address to assign to the user
 * @param token - The confirmation token to validate against the stored token
 */
const updateUserNewEmailConfirmation = (newEmail, token) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query("UPDATE auth_service.users SET is_verified = true, email = new_email, new_email = NULL, confirmation_token = NULL WHERE new_email = $1 AND confirmation_token = $2 RETURNING *", [newEmail, token]);
    return result.rows.length > 0 ? result.rows[0] : null;
});
exports.updateUserNewEmailConfirmation = updateUserNewEmailConfirmation;
/**
 * Updates the reset password token for a user identified by their email address.
 * @param email - The email address of the user whose reset token is being updated
 * @param resetToken - The new reset token to assign to the user
 */
const updateUserResetToken = (email, resetToken) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.query("UPDATE auth_service.users SET reset_token = $1 WHERE email = $2", [resetToken, email]);
});
exports.updateUserResetToken = updateUserResetToken;
/**
 * Resets a user's password using a reset token.
 *
 * @param email - The email address of the user whose password is being reset
 * @param token - The reset token that was previously generated and sent to the user
 * @param newPassword - The new password to set for the user
 * @returns A Promise that resolves to the updated User object if successful, or null if the token/email combination is invalid
 */
const resetUserPassword = (email, token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const password_hash = yield bcryptjs_1.default.hash(newPassword, 10);
    const result = yield db_1.default.query("UPDATE auth_service.users SET password_hash = $1, reset_token = NULL WHERE email = $2 AND reset_token = $3 RETURNING *", [password_hash, email, token]);
    return result.rows.length > 0 ? result.rows[0] : null;
});
exports.resetUserPassword = resetUserPassword;
/**
 * Updates a user's password in the database.
 *
 * @param id - The unique identifier of the user whose password is being updated
 * @param newPassword - The new password to be set for the user
 */
const updateUserPassword = (id, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const password_hash = yield bcryptjs_1.default.hash(newPassword, 10);
    yield db_1.default.query("UPDATE auth_service.users SET password_hash = $1 WHERE id = $2", [password_hash, id]);
});
exports.updateUserPassword = updateUserPassword;
/**
 * Updates a user's email address and sets their account to unconfirmed status.
 * The user will need to confirm their new email address using the provided confirmation token.
 *
 * @param id - The unique identifier of the user to update
 * @param newEmail - The new email address to assign to the user
 * @param confirmationToken - A token used to verify the user's new email address
 */
const updateUserEmail = (id, newEmail, confirmationToken) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.query("UPDATE auth_service.users SET new_email = $1, confirmation_token = $2, is_verified = false WHERE id = $3", [newEmail, confirmationToken, id]);
});
exports.updateUserEmail = updateUserEmail;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.query("DELETE FROM auth_service.users WHERE id = $1", [id]);
});
exports.deleteUser = deleteUser;
/**
 * Sets the user's local FirebaseCloudMessaging token
 *
 * @param id - The unique identifier of the user
 * @param fcmToken - The new FCM token
 */
const updateUserFCMToken = (id, fcmToken) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.query("UPDATE auth_service.users SET fcm_token = $1 WHERE id = $2", [
        id,
        fcmToken,
    ]);
});
exports.updateUserFCMToken = updateUserFCMToken;
/**
 * Gets the user's local FirebaseCloudMessaging token
 *
 * @param id - The unique identifier of the user
 */
const getUserFCMToken = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query("SELECT fcm_token FROM auth_service.users WHERE id = $1", [id]);
    return result.rows.length > 0 ? result.rows[0].fcm_token : null;
});
exports.getUserFCMToken = getUserFCMToken;
/**
 * Creates the admin user if it does not already exist
 */
const createAdminUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const fname = process.env.ASCEND_ADMIN_FIRST_NAME;
    const lname = process.env.ASCEND_ADMIN_LAST_NAME;
    const email = process.env.ASCEND_ADMIN_EMAIL;
    const password = process.env.ASCEND_ADMIN_PASSWORD;
    if (!email || !password || !fname || !lname) {
        throw new Error("Missing required environment variables for admin user creation");
    }
    const existingUser = yield (0, exports.findUserByEmail)(email);
    if (existingUser) {
        console.log("Admin user already exists");
        return;
    }
    const user = yield (0, exports.createUser)(fname, lname, email, password, true, models_1.UserRole.ADMIN);
    console.log("Created admin user:", user);
});
exports.createAdminUser = createAdminUser;
/**
 * Retrieves the admin user ID
 */
const getAdminUserId = () => __awaiter(void 0, void 0, void 0, function* () {
    const email = process.env.ASCEND_ADMIN_EMAIL;
    if (!email) {
        throw new Error("ASCEND_ADMIN_EMAIL is not defined");
    }
    const result = yield db_1.default.query("SELECT id FROM auth_service.users WHERE email = $1", [email]);
    return result.rows.length > 0 ? result.rows[0].id : null;
});
exports.getAdminUserId = getAdminUserId;
