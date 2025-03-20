import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import pool from '../config/db';
import { sendEmail } from '../services/emailService';
import { verifyGoogleToken } from '../services/googleAuthService';
import {
    createUser,
    deleteUser,
    findUserByEmail,
    findUserById,
    resetUserPassword,
    updateUserEmail,
    updateUserEmailConfirmation,
    updateUserNewEmailConfirmation,
    updateUserPassword,
    updateUserResetToken,
} from '../services/userService';
import { generateToken, verifyToken } from '../utils/jwt';

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
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Create user
        const user = await createUser(first_name, last_name, email, password);

        // Send confirmation email
        const confirmation_token = generateToken({ email }, '24h');
        await sendEmail(
            email,
            'Confirm Your Email',
            `Click this link to confirm your email: http://localhost:3001/auth/confirm-email?token=${confirmation_token}`
        );

        res.status(201).json({ id: user.id, email: user.email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
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
 * Tokens are valid for 1 hour
 */
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!user.is_verified) {
            return res.status(403).json({ error: 'Email not confirmed' });
        }

        if (!user.password_hash || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken({ id: user.id }); // 1h expiration
        res.json({ token, userId: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
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
    const { token } = req.body;

    try {
        const { email, isNewEmail } = verifyToken(token);

        let user = isNewEmail ? await updateUserNewEmailConfirmation(email, token)
            : await updateUserEmailConfirmation(email, token);
        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        res.json({ message: 'Email confirmed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
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
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.is_verified) {
            return res.status(400).json({ error: 'Email already confirmed' });
        }

        const confirmation_token = generateToken({ email, isNewEmail: false }, '24h');
        await pool.query(
            'UPDATE auth_service.users SET confirmation_token = $1 WHERE email = $2',
            [confirmation_token, email]
        );

        await sendEmail(
            email,
            'Confirm Your Email',
            `Click this link to confirm your email: http://localhost:3001/auth/confirm-email?token=${confirmation_token}`
        );

        res.json({ message: 'Confirmation email resent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
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
    const { email } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const reset_token = generateToken({ email }, '1h');
        await updateUserResetToken(email, reset_token);

        await sendEmail(
            email,
            'Reset Your Password',
            `Click this link to reset your password: http://localhost:3001/auth/reset-password?token=${reset_token}`
        );

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
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
    const { token, new_password } = req.body;

    try {
        const { email } = verifyToken(token);

        const user = await resetUserPassword(email, token, new_password);
        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
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
export const updatePassword = async (req: Request, res: Response) => {
    const { old_password, new_password } = req.body;
    const userId = req.user!.id; // Middleware ensures user is authenticated

    try {
        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.password_hash || !(await bcrypt.compare(old_password, user.password_hash))) {
            return res.status(401).json({ error: 'Invalid old password' });
        }

        await updateUserPassword(userId, new_password);
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
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
export const updateEmail = async (req: Request, res: Response) => {
    const { new_email } = req.body;
    const userId = req.user!.id; // Middleware ensures user is authenticated

    if (!new_email) {
        return res.status(400).json({ error: 'Missing new email' });
    }

    try {
        const existingUser = await findUserByEmail(new_email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const confirmation_token = generateToken({ email: new_email, isNewEmail: true }, '24h');
        await updateUserEmail(userId, new_email, confirmation_token);

        await sendEmail(
            new_email,
            'Confirm Your New Email',
            `Click this link to confirm your new email: http://localhost:3001/auth/confirm-email?token=${confirmation_token}`
        );

        res.json({ message: 'Confirmation email sent to new email address' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
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
    const { token } = req.body;

    try {
        const payload = await verifyGoogleToken(token);
        if (!payload) {
            return res.status(401).json({ error: 'Invalid Google token' });
        }

        const firstName = payload.given_name;
        const lastName = payload.family_name;
        const email = payload.email;
        if (!firstName || !lastName || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create an already verified user if they don't exist
        let user = await findUserByEmail(email);
        if (!user) {
            user = await createUser(firstName, lastName, email, undefined, true);
        }

        const jwtToken = generateToken({ id: user.id });
        res.json({ token: jwtToken, userId: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
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
export const deleteAccount = async (req: Request, res: Response) => {
    const userId = req.user!.id; // Middleware ensures user is authenticated

    try {
        if (!(await findUserById(userId))) {
            return res.status(404).json({ error: 'User not found' });
        }

        await deleteUser(userId);
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};