import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import validate from "@shared/middleware/validationMiddleware";
import { Response } from "express";
import { createOrUpdateProfile, getProfile } from "../services/userService";
import { updateUserProfileValidationRules } from "../validations/userValidation";

/**
 * Retrieves the logged in user's profile
 *
 * @returns HTTP response
 * - 200 with the user's profile
 * - 404 if profile not found
 * - 500 if server error
 */
export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user!.id;
  try {
    const profile = await getProfile(userId);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Updates the logged in user's profile
 *
 * @returns HTTP response
 * - 200 with the updated profile
 * - 500 if server error
 */
export const updateUserProfile = [
  ...updateUserProfileValidationRules,
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    try {
      const profileData = req.body;

      // Update profile
      const profile = await createOrUpdateProfile(userId, profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
];
