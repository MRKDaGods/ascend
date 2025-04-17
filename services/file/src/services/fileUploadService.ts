import db from "@shared/config/db";
import { FileMetadata } from "@shared/models";
import { generateToken } from "@shared/utils/jwt";
import { Client } from "minio";
import { Readable } from "stream";

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || "minio",
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const bucketName = process.env.MINIO_BUCKET || "ascend-files";

/**
 * Initializes the MinIO client and creates the bucket if it doesn't exist
 */
export const initMinIO = async (): Promise<void> => {
  // Create the bucket if it doesn't exist
  const exists = await minioClient.bucketExists(bucketName);
  if (!exists) {
    await minioClient.makeBucket(bucketName);
    console.log(`Created bucket: ${bucketName}`);
  }
};

/**
 * Uploads a file to MinIO and stores the metadata in the database
 *
 * @param userId - The unique identifier of the user
 * @param file - The file to upload
 * @param context - The context of the file (profile, resume, etc)
 * @returns The unique identifier of the file
 */
export const uploadFileToMinIO = async (
  userId: number,
  file: Express.Multer.File,
  context?: string
): Promise<number> => {
  // Generate a unique object name
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${
    file.originalname
  }`; // 1621234567890-1234567890-profile.jpg

  // Upload the file to MinIO
  const stream = Readable.from(file.buffer);
  await minioClient.putObject(bucketName, fileName, stream, file.size, {
    "Content-Type": file.mimetype,
  });

  // Store in db
  const result = await db.query(
    "INSERT INTO file_service.files (user_id, file_name, mime_type, file_size, context) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [userId, fileName, file.mimetype, file.size, context]
  );

  return result.rows[0].id;
};

/**
 * Deletes a file from MinIO and removes the metadata from the database
 *
 * @param fileId - The unique identifier of the file
 */
export const deleteFileFromMinIO = async (fileId: number): Promise<void> => {
  const result = await db.query(
    "SELECT file_name FROM file_service.files WHERE id = $1",
    [fileId]
  );

  if (result.rows.length === 0) {
    throw new Error("File not found");
  }

  const fileName = result.rows[0].file_name;
  await minioClient.removeObject(bucketName, fileName);
  await db.query("DELETE FROM file_service.files WHERE id = $1", [fileId]);
};

/**
 * Generates a presigned URL for a file
 *
 * @param fileId - The unique identifier of the file
 * @returns The presigned URL
 */
export const getPresignedUrl = async (fileId: number): Promise<string> => {
  const result = await db.query(
    "SELECT * FROM file_service.files WHERE id = $1",
    [fileId]
  );

  if (result.rows.length === 0) {
    throw new Error("File not found");
  }

  // Create a presigned URL that expires in 1 hour
  const token = generateToken(
    {
      file_id: fileId,
    },
    "1h"
  );

  return `${process.env.GATEWAY_ENDPOINT}/files/view?token=${token}`;
};

/**
 * Retrieves file metadata
 *
 * @param fileId - The unique identifier of the file
 * @returns The file metadata
 */
export const getFileMetadata = async (
  fileId: number
): Promise<FileMetadata | null> => {
  const result = await db.query(
    "SELECT * FROM file_service.files WHERE id = $1",
    [fileId]
  );

  return result.rows.length > 0 ? (result.rows[0] as FileMetadata) : null;
};

/**
 * Retrieves a file from MinIO
 *
 * @param fileId - The unique identifier of the file
 * @returns The file buffer
 */
export const getFileFromMinIO = async (fileId: number): Promise<Buffer> => {
  const result = await db.query(
    "SELECT file_name FROM file_service.files WHERE id = $1",
    [fileId]
  );

  if (result.rows.length === 0) {
    throw new Error("File not found");
  }

  const fileName = result.rows[0].file_name;
  const stream = await minioClient.getObject(bucketName, fileName);
  const buffers: Buffer[] = [];

  for await (const chunk of stream) {
    buffers.push(chunk);
  }

  return Buffer.concat(buffers);
};
