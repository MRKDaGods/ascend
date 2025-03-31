import { WasmApiClient } from "./api_client";
export declare class ApiClient {
    baseUrl: string;
    private client;
    private _auth;
    constructor(baseUrl: string);
    initialize(): Promise<void>;
    get auth(): AuthService;
}
declare class AuthService {
    private client;
    constructor(client: WasmApiClient);
    /**
     * The currently authenticated user's token
     * @returns The auth token
     * @throws Error if user is not authenticated
     */
    get authToken(): string;
    /**
     * Logs in a user with email and password
     * @param email - The user's email address
     * @param password - The user's password
     * @returns A promise that resolves to an object containing the auth token and user ID
     * @throws Error if the login fails
     */
    login(email: string, password: string): Promise<{
        token: string;
        user_id: number;
    }>;
    /**
     * Registers a new user with first name, last name, email, and password
     * @param first_name - The user's first name
     * @param last_name - The user's last name
     * @param email - The user's email address
     * @param password - The user's password
     * @returns A promise that resolves to an object containing the user ID and email
     * @throws Error if the registration fails
     */
    register(first_name: string, last_name: string, email: string, password: string): Promise<{
        user_id: number;
        email: string;
    }>;
    /**
     * Resends the confirmation email to the user
     * @param email - The user's email address
     * @throws Error if the email cannot be resent
     */
    resendConfirmationEmail(email: string): Promise<void>;
    /**
     * Updates the currently authenticated user's password
     * @param old_password - The user's current password
     * @param new_password - The user's new password
     * @throws Error if the password update fails
     */
    updatePassword(old_password: string, new_password: string): Promise<void>;
    /**
     * Updates the currently authenticated user's email address
     * (Sends a confirmation email to the new address)
     * @param new_email - The user's new email address
     * @throws Error if the email update fails
     */
    updateEmail(new_email: string): Promise<void>;
    /**
     * Requests a password reset for the user
     * @param email - The user's email address
     * @throws Error if the password reset request fails
     */
    forgetPassword(email: string): Promise<void>;
    /**
     * Resets the user's password using a token and new password
     * @param token - The password reset token
     * @param new_password - The user's new password
     * @throws Error if the password reset fails
     */
    resetPassword(token: string, new_password: string): Promise<void>;
    /**
     * Deletes the currently authenticated user's account (irreversible)
     * @throws Error if the account deletion fails
     */
    deleteAccount(): Promise<void>;
    /**
     * Logs out the currently authenticated user
     * @throws Error if the logout fails
     */
    logout(): Promise<void>;
}
export {};
