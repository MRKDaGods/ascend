import init, { WasmApiClient } from "./api_client";
import { Profile } from "./models";

// Sanitize dates - convert any Date objects to ISO strings
// This is necessary because the API expects ISO string dates
const sanitizeDates = (obj: any): any => {
  if (!obj) return obj;

  if (obj instanceof Date) {
    return obj.toISOString();
  }

  if (typeof obj === "object") {
    if (Array.isArray(obj)) {
      return obj.map((item) => sanitizeDates(item));
    } else {
      const result: any = {};
      for (const key in obj) {
        result[key] = sanitizeDates(obj[key]);
      }
      return result;
    }
  }

  return obj;
};

export class ApiClient {
  private client: WasmApiClient | null = null;
  private _auth: AuthService | null = null;
  private _user: UserService | null = null;

  constructor(public baseUrl: string) {}

  async initialize(): Promise<void> {
    if (this.client) {
      return;
    }

    await init();
    this.client = new WasmApiClient(this.baseUrl);

    // Init services
    this._auth = new AuthService(this.client);
    this._user = new UserService(this.client);
  }

  // Services
  get auth(): AuthService {
    if (!this._auth) {
      throw new Error("ApiClient not initialized");
    }

    return this._auth;
  }

  get user(): UserService {
    if (!this._user) {
      throw new Error("ApiClient not initialized");
    }

    return this._user;
  }
}

class AuthService {
  constructor(private client: WasmApiClient) {
    // Try to set the auth token from local storage
    const token = localStorage.getItem("auth_token");
    if (token) {
      this.client.set_auth_token(token);
    }
  }

  /**
   * The currently authenticated user's token
   * @returns The auth token
   * @throws Error if user is not authenticated
   */
  get authToken(): string {
    return this.client.get_auth_token();
  }

  /**
   * Logs in a user with email and password
   * @param email - The user's email address
   * @param password - The user's password
   * @returns A promise that resolves to an object containing the auth token and user ID
   * @throws Error if the login fails
   */
  async login(
    email: string,
    password: string
  ): Promise<{ token: string; user_id: number }> {
    const response = await this.client.login(email, password);

    // Set auth token
    localStorage.setItem("auth_token", response.token);
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
  async register(
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ): Promise<{ user_id: number; email: string }> {
    return this.client.register(first_name, last_name, email, password);
  }

  /**
   * Resends the confirmation email to the user
   * @param email - The user's email address
   * @throws Error if the email cannot be resent
   */
  async resendConfirmationEmail(email: string): Promise<void> {
    return this.client.resend_confirm_email(email);
  }

  /**
   * Updates the currently authenticated user's password
   * @param old_password - The user's current password
   * @param new_password - The user's new password
   * @throws Error if the password update fails
   */
  async updatePassword(
    old_password: string,
    new_password: string
  ): Promise<void> {
    return this.client.update_password(old_password, new_password);
  }

  /**
   * Updates the currently authenticated user's email address
   * (Sends a confirmation email to the new address)
   * @param new_email - The user's new email address
   * @throws Error if the email update fails
   */
  async updateEmail(new_email: string): Promise<void> {
    return this.client.update_email(new_email);
  }

  /**
   * Requests a password reset for the user
   * @param email - The user's email address
   * @throws Error if the password reset request fails
   */
  async forgetPassword(email: string): Promise<void> {
    return this.client.forget_password(email);
  }

  /**
   * Resets the user's password using a token and new password
   * @param token - The password reset token
   * @param new_password - The user's new password
   * @throws Error if the password reset fails
   */
  async resetPassword(token: string, new_password: string): Promise<void> {
    return this.client.reset_password(token, new_password);
  }

  /**
   * Deletes the currently authenticated user's account (irreversible)
   * @throws Error if the account deletion fails
   */
  async deleteAccount(): Promise<void> {
    return this.client.delete_account();
  }

  /**
   * Logs out the currently authenticated user
   * @throws Error if the logout fails
   */
  async logout(): Promise<void> {
    // Remove auth token from local storage
    localStorage.removeItem("auth_token");
    return this.client.logout();
  }
}

class UserService {
  constructor(private client: WasmApiClient) {}

  /**
   * Retrieves the currently authenticated user's profile
   * @returns The user's profile
   * @throws Error if the user is not authenticated
   */
  async getLocalUserProfile(): Promise<Profile> {
    return this.client.get_local_user_profile();
  }

  /**
   * Updates the currently authenticated user's profile
   * @param profile - The user's profile data
   * @returns The updated profile
   * @throws Error if the update fails
   *
   * @remarks The profile object must contain at least first_name and last_name
   */
  async updateLocalUserProfile(
    profile: Partial<Profile> & { first_name: string; last_name: string }
  ): Promise<Profile> {
    // Sanitize the profile object
    const sanitizedProfile = sanitizeDates(profile);
    return this.client.update_local_user_profile(sanitizedProfile);
  }

  /**
   * Uploads a profile picture for the currently authenticated user
   * @param file - The image file to upload
   * @returns The updated profile with the new profile picture URL
   * @throws Error if the upload fails
   */
  async uploadProfilePicture(
    file: File
  ): Promise<Profile> {
    const name = file.name;
    const mime = file.type;
    const buffer = await file.bytes();
    return this.client.upload_profile_picture(name, mime, buffer);
  }

  /**
   * Deletes the currently authenticated user's profile picture
   * @returns The updated profile with the profile picture removed
   * @throws Error if the deletion fails
   */
  async deleteProfilePicture(): Promise<Profile> {
    return this.client.delete_profile_picture();
  }

  /**
   * Uploads a cover photo for the currently authenticated user
   * @param file - The image file to upload
   * @returns The updated profile with the new cover photo URL
   * @throws Error if the upload fails
   */
  async uploadCoverPhoto(
    file: File
  ): Promise<Profile> {
    const name = file.name;
    const mime = file.type;
    const buffer = await file.bytes();
    return this.client.upload_cover_photo(name, mime, buffer);
  }

  /**
   * Deletes the currently authenticated user's cover photo
   * @returns The updated profile with the cover photo removed
   * @throws Error if the deletion fails
   */
  async deleteCoverPhoto(): Promise<Profile> {
    return this.client.delete_cover_photo();
  }

  /**
   * Uploads a resume for the currently authenticated user
   * @param file - The resume file to upload
   * @returns The updated profile with the new resume URL
   * @throws Error if the upload fails
   */
  async uploadResume(
    file: File
  ): Promise<Profile> {
    const name = file.name;
    const mime = file.type;
    const buffer = await file.bytes();
    return this.client.upload_resume(name, mime, buffer);
  }

  /**
   * Deletes the currently authenticated user's resume
   * @returns The updated profile with the resume removed
   * @throws Error if the deletion fails
   */
  async deleteResume(): Promise<Profile> {
    return this.client.delete_resume();
  }
}
