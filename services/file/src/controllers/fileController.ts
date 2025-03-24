import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import { Request, Response } from "express";
import {
    getFileFromMinIO,
  getFileMetadata as serviceGetFileMetadata,
  uploadFileToMinIO,
} from "../services/fileUploadService";
import { verifyToken } from "@shared/utils/jwt";

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

    const file = await serviceGetFileMetadata(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json(file);
  } catch (error) {
    console.error("Error getting file metadata:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const viewFile = async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;
    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }

    const fileId = verifyToken(token).file_id;
    if (!fileId) {
      return res.status(400).json({ error: "No file ID provided" });
    }

    const buffer = await getFileFromMinIO(fileId);
    res.end(buffer);
  } catch (error) {
    console.error("Error viewing file:", error);
    res.status(500).json({ error: "Server error" });
  }
};
