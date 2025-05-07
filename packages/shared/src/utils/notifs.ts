import { NotificationType } from "@shared/models";
import { Events, publishEvent } from "@shared/rabbitMQ";

export const sendNotificationMf = async (
  userId: number,
  type: NotificationType,
  message: string,
  payload: Record<string, any> | null = null,
  title: string | null = null
): Promise<void> => {
  try {
    await publishEvent(Events.NOTIFICATION_SEND, {
      user_id: userId,
      type,
      message,
      payload,
      title,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
