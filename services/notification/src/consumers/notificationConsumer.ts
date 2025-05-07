import { SendNotificationPayload, UserCreatedPayload } from "@shared/rabbitMQ";
import {
  createNotification,
  sendWelcomeNotification,
} from "../services/notificationService";

export const handleUserCreated = async (
  payload: UserCreatedPayload
): Promise<void> => {
  console.log("Received user.created event:", payload);

  // Send welcome notification to user
  console.log(`Sending welcome notification to user ${payload.user_id}`);
  await sendWelcomeNotification(payload.user_id);
};

export const handleSendNotification = async (
  payload: SendNotificationPayload
): Promise<void> => {
  console.log("Received send.notification event:", payload);

  // Send notification to user
  console.log(`Sending notification to user ${payload.user_id}`);
  await createNotification(
    payload.user_id,
    payload.type,
    payload.message,
    payload.payload,
    payload.title
  );
};
