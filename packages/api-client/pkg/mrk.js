import init, { WasmApiClient } from "./api_client";
export class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.client = null;
        this._auth = null;
    }
    async initialize() {
        if (this.client) {
            return;
        }
        await init();
        this.client = new WasmApiClient(this.baseUrl);
        // Init services
        this._auth = new AuthService(this.client);
    }
    // Services
    get auth() {
        if (!this._auth) {
            throw new Error("ApiClient not initialized");
        }
        return this._auth;
    }
}
class AuthService {
    constructor(client) {
        this.client = client;
    }
    /**
     * The currently authenticated user's token
     * @returns The auth token
     * @throws Error if user is not authenticated
     */
    get authToken() {
        return this.client.get_auth_token();
    }
    /**
     * Logs in a user with email and password
     * @param email - The user's email address
     * @param password - The user's password
     * @returns A promise that resolves to an object containing the auth token and user ID
     * @throws Error if the login fails
     */
    async login(email, password) {
        const response = await this.client.login(email, password);
        // Set auth token
        this.client.set_auth_token(response.token);
        return response;
    }
    /**
     * Registers a new user with first name, last name, email, and password
     * @param first_name - The user's first name
     * @param last_name - The user's last name
     * @param email - The user's email address
     * @param password - The user's password
     * @returns A promise that resolves to an object containing the user ID and email
     * @throws Error if the registration fails
     */
    async register(first_name, last_name, email, password) {
        return this.client.register(first_name, last_name, email, password);
    }
    /**
     * Resends the confirmation email to the user
     * @param email - The user's email address
     * @throws Error if the email cannot be resent
     */
    async resendConfirmationEmail(email) {
        return this.client.resend_confirm_email(email);
    }
    /**
     * Updates the currently authenticated user's password
     * @param old_password - The user's current password
     * @param new_password - The user's new password
     * @throws Error if the password update fails
     */
    async updatePassword(old_password, new_password) {
        return this.client.update_password(old_password, new_password);
    }
    /**
     * Updates the currently authenticated user's email address
     * (Sends a confirmation email to the new address)
     * @param new_email - The user's new email address
     * @throws Error if the email update fails
     */
    async updateEmail(new_email) {
        return this.client.update_email(new_email);
    }
    /**
     * Requests a password reset for the user
     * @param email - The user's email address
     * @throws Error if the password reset request fails
     */
    async forgetPassword(email) {
        return this.client.forget_password(email);
    }
    /**
     * Resets the user's password using a token and new password
     * @param token - The password reset token
     * @param new_password - The user's new password
     * @throws Error if the password reset fails
     */
    async resetPassword(token, new_password) {
        return this.client.reset_password(token, new_password);
    }
    /**
     * Deletes the currently authenticated user's account (irreversible)
     * @throws Error if the account deletion fails
     */
    async deleteAccount() {
        return this.client.delete_account();
    }
    /**
     * Logs out the currently authenticated user
     * @throws Error if the logout fails
     */
    async logout() {
        return this.client.logout();
    }
}
