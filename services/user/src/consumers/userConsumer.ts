import { ConsumeMessage } from "amqplib";
import {
  checkProfileExists,
  createOrUpdateProfile,
} from "../services/userService";
import { UserCreatedPayload } from "@shared/rabbitMQ";

export const handleUserCreated = async (msg: ConsumeMessage): Promise<void> => {
  const event = JSON.parse(msg.content.toString());
  console.log("Received user.created event:", event);

  const payload: UserCreatedPayload = event;

  // Check if profile already exists
  const exists = await checkProfileExists(payload.user_id);
  if (exists) {
    console.log(`Profile for user ${payload.user_id} already exists`);
    return;
  }

  // Create new profile
  await createOrUpdateProfile(payload.user_id, {
    first_name: payload.first_name,
    last_name: payload.last_name,
    contact_info: {
      email: payload.email,
      user_id: payload.user_id,
    },
  });

  console.log(`Created profile for user ${payload.user_id}`);
};
