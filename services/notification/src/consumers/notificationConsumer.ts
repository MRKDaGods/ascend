import { UserCreatedPayload } from "@shared/rabbitMQ";
import { sendWelcomeNotification } from "../services/notificationService";

export const handleUserCreated = async (
  payload: UserCreatedPayload
): Promise<void> => {
  console.log("Received user.created event:", payload);

  // Send welcome notification to user
  console.log(`Sending welcome notification to user ${payload.user_id}`);
  await sendWelcomeNotification(payload.user_id);
};
