import {
  FileDeletePayload,
  FilePresignedUrlPayload,
  FileUploadPayload,
} from "@shared/rabbitMQ";
import {
  deleteFileFromMinIO,
  getPresignedUrl,
  uploadFileToMinIO,
} from "../services/fileUploadService";
import { validateFileSize } from "../validations/fileValidation";

/**
 * Handles the file.url_rpc event
 **/
export const handleGetPresignedUrlRPC = async (
  payload: FilePresignedUrlPayload.Request
): Promise<FilePresignedUrlPayload.Response | null> => {
  console.log("Received file.rpc event:", JSON.stringify(payload));

  const file_id = payload.file_id;
  if (!file_id) {
    console.error("Invalid file ID");
    return null;
  }

  // Generate a pre-signed URL
  const fileUrl = await getPresignedUrl(file_id);
  console.log(`Generated pre-signed URL for file ${file_id}: ${fileUrl}`);

  const response: FilePresignedUrlPayload.Response = {
    file_id,
    presigned_url: fileUrl,
  };
  return response;
};

/**
 * Handles the file.upload_rpc event
 **/
export const handleFileUploadRPC = async (
  payload: FileUploadPayload.Request
): Promise<FileUploadPayload.Response> => {
  console.log("Received file.upload event");
  console.log(`msg content: ${payload}`);
  if (
    !payload.user_id ||
    !payload.file_buffer ||
    !payload.file_name ||
    !payload.mime_type ||
    !payload.file_size
  ) {
    throw new Error("Missing required fields for file upload");
  }

  if (!validateFileSize(payload.file_size)) {
    throw new Error("File size exceeds the maximum limit");
  }

  // Decode file buffer
  const buffer = Buffer.from(payload.file_buffer, "base64");

  // Create a mock Multer File object
  const file: Express.Multer.File = {
    buffer,
    originalname: payload.file_name,
    mimetype: payload.mime_type,
    size: payload.file_size,
    fieldname: "file",
    encoding: "7bit",
    destination: "",
    filename: "",
    path: "",
    stream: null as any,
  };

  const fileId = await uploadFileToMinIO(
    payload.user_id,
    file,
    payload.context
  );

  const response: FileUploadPayload.Response = { file_id: fileId };
  return response;
};

/**
 * Handles the file.delete event
 **/
export const handleFileDelete = async (
  payload: FileDeletePayload
): Promise<void> => {
  console.log("Received file.deleted event:", payload);

  if (!payload.file_id) {
    console.error("Invalid file.deleted event received:", event);
    return;
  }

  // Delete!
  deleteFileFromMinIO(payload.file_id);
  console.log(`Deleted file ${payload.file_id}`);
};
