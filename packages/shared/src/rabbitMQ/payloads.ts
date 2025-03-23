/**
 * Represents the payload for a user creation event.
 *
 * @interface UserCreatedPayload
 * @property {number} user_id - The unique identifier for the user.
 * @property {string} first_name - The user's first name.
 * @property {string} last_name - The user's last name.
 * @property {string} email - The user's email address.
 */
export interface UserCreatedPayload {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
}
