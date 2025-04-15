import { AuthGetAdminPayload, AuthFCMTokenPayload } from "@shared/rabbitMQ";
import { getAdminUserId, getUserFCMToken } from "../services/userService";

/**
 * Handles the user.fcm_token_rpc event
 **/
export const handleGetUserFCMTokenRPC = async (
  payload: AuthFCMTokenPayload.Request
): Promise<AuthFCMTokenPayload.Response | null> => {
  console.log("Received user.fcm_token_rpc event:", JSON.stringify(payload));

  const user_id = payload.user_id;
  if (!user_id) {
    throw new Error("Invalid user ID");
  }

  // Get the user's FCM token
  const fcmToken = await getUserFCMToken(user_id);
  if (!fcmToken) {
    console.error(`Failed to retrieve FCM token for user ${user_id}`);
    return null;
  }

  console.log(`Retrieved FCM token for user ${user_id}: ${fcmToken}`);

  const response: AuthFCMTokenPayload.Response = {
    user_id,
    fcm_token: fcmToken,
  };
  return response;
};

/**
 * Handles the auth.get_admin_rpc event
 **/
export const handleGetAdminUserRPC = async (
  payload: AuthGetAdminPayload.Request
): Promise<AuthGetAdminPayload.Response | null> => {
  console.log("Received auth.get_admin_rpc event");

  // Get the admin user ID
  const user_id = await getAdminUserId();
  if (!user_id) {
    console.error("Failed to retrieve admin user ID");
    return null;
  }

  console.log(`Retrieved admin user ID: ${user_id}`);

  const response: AuthGetAdminPayload.Response = {
    user_id,
  };
  return response;
};
