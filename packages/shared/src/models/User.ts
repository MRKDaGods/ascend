export enum UserRole {
    USER = 'user',
    MODERATOR = 'moderator',
    ADMIN = 'admin'
}

/**
 * Interface representing a user in the system.
 * 
 * @interface User
 * @property {number} id - Unique identifier for the user
 * @property {string} first_name - User's first name
 * @property {string} last_name - User's last name
 * @property {string} email - User's email address
 * @property {string} [password_hash] - Hashed password for authentication (optional)
 * @property {UserRole} role - User's role in the system
 * @property {string} [confirmation_token] - Token used for account confirmation (optional)
 * @property {string} [reset_token] - Token used for password reset (optional)
 * @property {string} [new_email] - New email address pending verification (optional)
 * @property {boolean} is_verified - Indicates if the user's account is verified
 * @property {Date} created_at - Timestamp when the user was created
 * @property {Date} updated_at - Timestamp when the user was last updated
 */
export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password_hash?: string;
    role: UserRole;
    confirmation_token?: string;
    reset_token?: string;
    new_email?: string;
    is_verified: boolean;
    created_at: Date;
    updated_at: Date;
}