import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import { Request, Response } from "express";
import {
  deleteFileFromMinIO,
  getFileMetadata as getFileMetadataFromMinIO,
  getPresignedUrl,
  uploadFileToMinIO,
} from "../services/fileUploadService";

/**
 * Uploads a file
 *
 * @returns HTTP response
 * - 200 with the file ID
 * - 400 if no file uploaded
 * - 500 if server error
 */
export const uploadFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = req.user!.id;
    const fileId = await uploadFileToMinIO(userId, file);
    res.json({ fileId });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Deletes a file
 *
 * @returns HTTP response
 * - 204 if successful
 * - 400 if no file ID provided
 * - 403 if user is not a service
 * - 500 if server error
 */
export const deleteFile = async (req: AuthenticatedRequest, res: Response) => {
  try { // Keep route in controller for, until we impl an admin panel
    // Only services can delete files
    if (!req.user!.isService) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const fileId = parseInt(req.params.fileId);
    if (!fileId) {
      return res.status(400).json({ error: "No file ID provided" });
    }

    await deleteFileFromMinIO(fileId);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Generates a presigned URL for a file
 *
 * @returns HTTP response
 * - 200 with the presigned URL
 * - 400 if no file ID provided
 * - 500 if server error
 */
export const getFileUrl = async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.fileId);
    if (!fileId) {
      return res.status(400).json({ error: "No file ID provided" });
    }

    const fileUrl = await getPresignedUrl(fileId);
    res.json({ fileUrl });
  } catch (error) {
    console.error("Error getting file URL:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Retrieves file metadata
 *
 * @returns HTTP response
 * - 200 with the file metadata
 * - 400 if no file ID provided or file not found
 * - 500 if server error
 */
export const getFileMetadata = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const fileId = parseInt(req.params.fileId);
    if (!fileId) {
      return res.status(400).json({ error: "No file ID provided" });
    }

    // TODO: check if the user has access to the file

    const file = await getFileMetadataFromMinIO(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json(file);
  } catch (error) {
    console.error("Error getting file metadata:", error);
    res.status(500).json({ error: "Server error" });
  }
};
