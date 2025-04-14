import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import validate from "@shared/middleware/validationMiddleware";
import { Response } from "express";
import {
  createOrUpdateProfile,
  getProfile,
  uploadProfilePicture as serviceUploadProfilePicture,
  uploadCoverPhoto as serviceUploadCoverPhoto,
  uploadResume as serviceUploadResume,
} from "../services/userService";
import {
  uploadProfilePictureValidationRules,
  updateUserProfileValidationRules,
  uploadCoverPhotoValidationRules,
  uploadResumeValidationRules,
} from "../validations/userValidation";

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

/**
 * Uploads a profile picture for the logged in user
 *
 * @returns HTTP response
 * - 200 with the updated profile
 * - 400 if no file uploaded
 * - 500 if server error
 */
export const uploadProfilePicture = [
  ...uploadProfilePictureValidationRules,
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = req.user!.id;
    try {
      const profile = await serviceUploadProfilePicture(userId, file);
      res.json(profile);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
];

/**
 * Deletes the profile picture for the logged in user
 *
 * @returns HTTP response
 * - 200 with the updated profile
 * - 500 if server error
 */
export const deleteProfilePicture = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user!.id;

  try {
    const profile = await serviceUploadProfilePicture(userId, null);
    res.json(profile);
  } catch (error) {
    console.error("Error deleting profile picture:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Uploads a cover photo for the logged in user
 *
 * @returns HTTP response
 * - 200 with the updated profile
 * - 400 if no file uploaded
 * - 500 if server error
 */
export const uploadCoverPhoto = [
  ...uploadCoverPhotoValidationRules,
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = req.user!.id;
    try {
      const profile = await serviceUploadCoverPhoto(userId, file);
      res.json(profile);
    } catch (error) {
      console.error("Error uploading cover photo:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
];

/**
 * Deletes the cover photo for the logged in user
 *
 * @returns HTTP response
 * - 200 with the updated profile
 * - 500 if server error
 */
export const deleteCoverPhoto = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user!.id;

  try {
    const profile = await serviceUploadCoverPhoto(userId, null);
    res.json(profile);
  } catch (error) {
    console.error("Error deleting cover photo:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Uploads a resume for the logged in user
 *
 * @returns HTTP response
 * - 200 with the updated profile
 * - 400 if no file uploaded
 * - 500 if server error
 */
export const uploadResume = [
  ...uploadResumeValidationRules,
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = req.user!.id;
    try {
      const profile = await serviceUploadResume(userId, file);
      res.json(profile);
    } catch (error) {
      console.error("Error uploading resume:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
];

/**
 * Deletes the resume for the logged in user
 *
 * @returns HTTP response
 * - 200 with the updated profile
 * - 500 if server error
 */
export const deleteResume = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user!.id;

  try {
    const profile = await serviceUploadResume(userId, null);
    res.json(profile);
  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({ error: "Server error" });
  }
};
