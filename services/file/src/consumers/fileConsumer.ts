import { consumeEvents, FileDeletedPayload } from "@shared/rabbitMQ";
import { ConsumeMessage } from "amqplib";
import { deleteFileFromMinIO } from "../services/fileUploadService";

export const handleFileDeleted = async (msg: ConsumeMessage): Promise<void> => {
  const event = JSON.parse(msg.content.toString());
  console.log("Received file.deleted event:", event);

  const payload: FileDeletedPayload = event;
  if (!payload.file_id) {
    console.error("Invalid file.deleted event received:", event);
    return;
  }

  // Delete!
  deleteFileFromMinIO(payload.file_id);
  console.log(`Deleted file ${payload.file_id}`);
};
