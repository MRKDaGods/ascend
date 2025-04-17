import {
  callRPC,
  Events,
  UserProfilePayload,
  getRPCQueueName,
} from "@shared/rabbitMQ";
import { Services } from "..";

export const getUserFullName = async (userId: number): Promise<string> => {
  try {
    const profileRpcQueue = getRPCQueueName(
      Services.USER,
      Events.USER_PROFILE_RPC
    );

    const payload: UserProfilePayload.Request = {
      user_id: userId,
    };

    const profileRes = await callRPC<UserProfilePayload.Response>(
      profileRpcQueue,
      payload
    );

    return profileRes.profile.first_name + " " + profileRes.profile.last_name;
  } catch (error) {
    console.error(`Error getting full name for user ${userId}:`, error);
    return "Unknown User";
  }
};

export const getUserProfilePictureUrl = async (
  userId: number
): Promise<string | null> => {
  try {
    const profileRpcQueue = getRPCQueueName(
      Services.USER,
      Events.USER_PROFILE_RPC
    );

    const payload: UserProfilePayload.Request = {
      user_id: userId,
    };

    const profileRes = await callRPC<UserProfilePayload.Response>(
      profileRpcQueue,
      payload
    );

    return profileRes.profile.profile_picture_url || null;
  } catch (error) {
    console.error(
      `Error getting profile picture url for user ${userId}:`,
      error
    );
    return null;
  }
};
