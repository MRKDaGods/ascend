import db from "@shared/config/db";
import { User } from "@shared/models";
import { events, publishEvent } from "@shared/rabbitMQ";
import bcrypt from "bcryptjs";

/**
 * Finds a user by their email address
 *
 * @param email - The email address of the user to find
 * @returns A Promise that resolves to the User object if found, or null if no user was found
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await db.query(
    "SELECT * FROM auth_service.users WHERE email = $1",
    [email]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Finds a user by their unique identifier
 *
 * @param id - The unique identifier of the user to find
 * @returns A Promise that resolves to the User object if found, or null if no user was found
 */
export const findUserById = async (id: number): Promise<User | null> => {
  const result = await db.query(
    "SELECT * FROM auth_service.users WHERE id = $1",
    [id]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Creates a new user record in the database
 * and publishes the user created event to RabbitMQ
 * so that the user service may create a user profile.
 *
 * @returns The newly created user record
 * @remarks Password is optional if it's a social login
 */
export const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password?: string | undefined,
  isVerified: boolean = false
): Promise<User> => {
  const password_hash = password ? await bcrypt.hash(password, 10) : "";
  const result = await db.query(
    "INSERT INTO auth_service.users (email, password_hash, is_verified) VALUES ($1, $2, $3) RETURNING *",
    [email, password_hash, isVerified]
  );

  const user = result.rows[0];

  // Publish user created event, and have the user service create a user profile
  try {
    // UserCreatedPayload
    await publishEvent(events.USER_CREATED, {
      user_id: user.id,
      first_name: firstName,
      last_name: lastName,
      email,
    });
  } catch (error) {
    console.error("Failed to publish user created event:", error);
  }

  return result.rows[0];
};

/**
 * Updates a user's email confirmation status in the database
 *
 * @param email - The email address of the user to confirm
 * @param token - The confirmation token to validate against the stored token
 * @returns The updated user record if successful, null if no matching user was found or token was invalid
 */
export const updateUserEmailConfirmation = async (
  email: string,
  token: string
): Promise<User | null> => {
  const result = await db.query(
    "UPDATE auth_service.users SET is_verified = true, confirmation_token = NULL WHERE email = $1 AND confirmation_token = $2 RETURNING *",
    [email, token]
  );

  return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Updates a user's new email address and confirmation token in the database.
 *
 * @param newEmail - The new email address to assign to the user
 * @param token - The confirmation token to validate against the stored token
 */
export const updateUserNewEmailConfirmation = async (
  newEmail: string,
  token: string
): Promise<User | null> => {
  const result = await db.query(
    "UPDATE auth_service.users SET is_verified = true, email = new_email, new_email = NULL, confirmation_token = NULL WHERE new_email = $1 AND confirmation_token = $2 RETURNING *",
    [newEmail, token]
  );

  return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Updates the reset password token for a user identified by their email address.
 * @param email - The email address of the user whose reset token is being updated
 * @param resetToken - The new reset token to assign to the user
 */
export const updateUserResetToken = async (
  email: string,
  resetToken: string
): Promise<void> => {
  await db.query(
    "UPDATE auth_service.users SET reset_token = $1 WHERE email = $2",
    [resetToken, email]
  );
};

/**
 * Resets a user's password using a reset token.
 *
 * @param email - The email address of the user whose password is being reset
 * @param token - The reset token that was previously generated and sent to the user
 * @param newPassword - The new password to set for the user
 * @returns A Promise that resolves to the updated User object if successful, or null if the token/email combination is invalid
 */
export const resetUserPassword = async (
  email: string,
  token: string,
  newPassword: string
): Promise<User | null> => {
  const password_hash = await bcrypt.hash(newPassword, 10);
  const result = await db.query(
    "UPDATE auth_service.users SET password_hash = $1, reset_token = NULL WHERE email = $2 AND reset_token = $3 RETURNING *",
    [password_hash, email, token]
  );

  return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Updates a user's password in the database.
 *
 * @param id - The unique identifier of the user whose password is being updated
 * @param newPassword - The new password to be set for the user
 */
export const updateUserPassword = async (
  id: number,
  newPassword: string
): Promise<void> => {
  const password_hash = await bcrypt.hash(newPassword, 10);
  await db.query(
    "UPDATE auth_service.users SET password_hash = $1 WHERE id = $2",
    [password_hash, id]
  );
};

/**
 * Updates a user's email address and sets their account to unconfirmed status.
 * The user will need to confirm their new email address using the provided confirmation token.
 *
 * @param id - The unique identifier of the user to update
 * @param newEmail - The new email address to assign to the user
 * @param confirmationToken - A token used to verify the user's new email address
 */
export const updateUserEmail = async (
  id: number,
  newEmail: string,
  confirmationToken: string
): Promise<void> => {
  await db.query(
    "UPDATE auth_service.users SET new_email = $1, confirmation_token = $2, is_verified = false WHERE id = $3",
    [newEmail, confirmationToken, id]
  );
};

export const deleteUser = async (id: number): Promise<void> => {
  await db.query("DELETE FROM auth_service.users WHERE id = $1", [id]);
};

/**
 * Sets the user's local FirebaseCloudMessaging token
 * 
 * @param id - The unique identifier of the user
 * @param fcmToken - The new FCM token
 */
export const setUserFCMToken = async (id: number, fcmToken: string): Promise<void> => {
  await db.query("UPDATE auth_service.users SET fcm_token = $1 WHERE id = $2", 
    [id, fcmToken]
  );
};