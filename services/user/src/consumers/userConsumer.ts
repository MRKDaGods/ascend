import {
  checkProfileExists,
  createOrUpdateProfile,
  getProfile,
  getUserProfilePictureURL,
} from "../services/userService";
import {
  UserCreatedPayload,
  UserProfilePayload,
  UserProfilePicPayload,
} from "@shared/rabbitMQ";

/**
 * Handles the user.created event
 */
export const handleUserCreated = async (
  payload: UserCreatedPayload
): Promise<void> => {
  console.log("Received user.created event:", payload);

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

/**
 * Handles the user.profile_pic_rpc event
 **/
export const handleUserProfilePicRequestRPC = async (
  payload: UserProfilePicPayload.Request
): Promise<UserProfilePicPayload.Response | null> => {
  console.log("Received user.profile_pic_rpc event:", payload);

  const user_id = payload.user_id;
  if (!user_id) {
    console.error("Invalid user ID");
    return null;
  }

  // Get the user's profile picture
  const profilePicUrl = await getUserProfilePictureURL(user_id);
  if (!profilePicUrl) {
    console.error(`Failed to retrieve profile picture for user ${user_id}`);
    return null;
  }

  console.log(
    `Retrieved profile picture for user ${user_id}: ${profilePicUrl}`
  );

  const response: UserProfilePicPayload.Response = {
    user_id,
    profile_pic_url: profilePicUrl,
  };
  return response;
};

/**
 * Handles the user.profile_rpc event
 **/
export const handleGetUserProfileRequestRPC = async (
  payload: UserProfilePayload.Request
): Promise<UserProfilePayload.Response | null> => {
  console.log("Received user.profile_rpc event:", payload);

  const user_id = payload.user_id;
  if (!user_id) {
    console.error("Invalid user ID");
    return null;
  }

  // Get the user's profile
  const profile = await getProfile(user_id);
  if (!profile) {
    console.error(`Failed to retrieve profile for user ${user_id}`);
    return null;
  }

  console.log(`Retrieved profile for user ${user_id}`);

  const response: UserProfilePayload.Response = {
    profile,
  };
  return response;
};
