import { WasmApiClient } from "./api_client";
import { Notification, Profile } from "./models";
export declare class ApiClient {
    baseUrl: string;
    private client;
    private _auth;
    private _user;
    private _notification;
    constructor(baseUrl: string);
    initialize(): Promise<void>;
    get initialized(): boolean;
    get auth(): AuthService;
    get user(): UserService;
    get notification(): NotificationService;
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
declare class UserService {
    private client;
    constructor(client: WasmApiClient);
    /**
     * Retrieves the currently authenticated user's profile
     * @returns The user's profile
     * @throws Error if the user is not authenticated
     */
    getLocalUserProfile(): Promise<Profile>;
    /**
     * Updates the currently authenticated user's profile
     * @param profile - The user's profile data
     * @returns The updated profile
     * @throws Error if the update fails
     *
     * @remarks The profile object must contain at least first_name and last_name
     */
    updateLocalUserProfile(profile: Partial<Profile> & {
        first_name: string;
        last_name: string;
    }): Promise<Profile>;
    /**
     * Uploads a profile picture for the currently authenticated user
     * @param file - The image file to upload
     * @returns The updated profile with the new profile picture URL
     * @throws Error if the upload fails
     */
    uploadProfilePicture(file: File): Promise<Profile>;
    /**
     * Deletes the currently authenticated user's profile picture
     * @returns The updated profile with the profile picture removed
     * @throws Error if the deletion fails
     */
    deleteProfilePicture(): Promise<Profile>;
    /**
     * Uploads a cover photo for the currently authenticated user
     * @param file - The image file to upload
     * @returns The updated profile with the new cover photo URL
     * @throws Error if the upload fails
     */
    uploadCoverPhoto(file: File): Promise<Profile>;
    /**
     * Deletes the currently authenticated user's cover photo
     * @returns The updated profile with the cover photo removed
     * @throws Error if the deletion fails
     */
    deleteCoverPhoto(): Promise<Profile>;
    /**
     * Uploads a resume for the currently authenticated user
     * @param file - The resume file to upload
     * @returns The updated profile with the new resume URL
     * @throws Error if the upload fails
     */
    uploadResume(file: File): Promise<Profile>;
    /**
     * Deletes the currently authenticated user's resume
     * @returns The updated profile with the resume removed
     * @throws Error if the deletion fails
     */
    deleteResume(): Promise<Profile>;
}
declare class NotificationService {
    private client;
    constructor(client: WasmApiClient);
    /**
     * Retrieves the currently authenticated user's notifications
     * @returns An array of notifications
     * @throws Error if the retrieval fails
     */
    getNotifications(page?: number): Promise<Notification[]>;
    /**
     * Marks a notification as read
     * @param notificationId - The ID of the notification to mark as read
     * @throws Error if the update fails
     */
    markNotificationAsRead(notificationId: number): Promise<void>;
    /**
     * Marks a notification as unread
     * @param notificationId - The ID of the notification to mark as unread
     * @throws Error if the update fails
     */
    markNotificationAsUnread(notificationId: number): Promise<void>;
    /**
     * Deletes a notification
     * @param notificationId - The ID of the notification to delete
     * @throws Error if the deletion fails
     */
    deleteNotification(notificationId: number): Promise<void>;
}
export {};
