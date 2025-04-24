import { Services } from "@ascend/shared";
import db from "@shared/config/db";
import {
  callRPC,
  Events,
  getRPCQueueName,
  UserProfilePayload,
} from "@shared/rabbitMQ";

export const banUser = async (
  userId: number,
  bannedById: number,
  expiresAt?: Date,
  reason?: string
) => {
  // Check if the user is already banned
  const existingBan = await db.query(
    "SELECT * FROM auth_service.bans WHERE user_id = $1",
    [userId]
  );

  // If the old ban is permanent, ignore
  if (existingBan.rows.length > 0 && existingBan.rows[0].expires_at === null) {
    throw new Error("User is already permanently banned.");
  }

  // If the old ban exceeds the new one, ignore
  if (
    expiresAt &&
    existingBan.rows.length > 0 &&
    existingBan.rows[0].expires_at &&
    new Date(existingBan.rows[0].expires_at) > new Date(expiresAt)
  ) {
    throw new Error("New ban must be longer than the old one.");
  }

  // Delete the old ban if it exists
  if (existingBan.rows.length > 0) {
    await db.query("DELETE FROM auth_service.bans WHERE user_id = $1", [
      userId,
    ]);
  }

  // Insert the new ban
  await db.query(
    "INSERT INTO auth_service.bans (user_id, banned_by, expires_at, reason) VALUES ($1, $2, $3, $4)",
    [userId, bannedById, expiresAt, reason]
  );
};

export const unbanUser = async (userId: number) => {
  // Check if the user is banned
  const existingBan = await db.query(
    "SELECT * FROM auth_service.bans WHERE user_id = $1",
    [userId]
  );

  // If the user is not banned, do nothing
  if (existingBan.rows.length === 0) {
    throw new Error("User is not banned.");
  }

  // Delete the ban
  await db.query("DELETE FROM auth_service.bans WHERE user_id = $1", [userId]);
};

export const isUserBanned = async (userId: number) => {
  const result = await db.query(
    "SELECT * FROM auth_service.bans WHERE user_id = $1",
    [userId]
  );
  return result.rows.length > 0;
};

export const getBannedUsers = async () => {
  const result = await db.query(
    "SELECT * FROM auth_service.bans WHERE expires_at IS NULL OR expires_at > NOW()"
  );

  // Try to get the user details for each banned user
  for (const ban of result.rows) {
    const ids = [ban.user_id, ban.banned_by];

    for (const id of ids) {
      if (!id) continue;
      try {
        const profileRpcQueue = getRPCQueueName(
          Services.USER,
          Events.USER_PROFILE_RPC
        );
        const payload: UserProfilePayload.Request = {
          user_id: id,
        };
        const profileRes = await callRPC<UserProfilePayload.Response>(
          profileRpcQueue,
          payload
        );

        if (profileRes && profileRes.profile) {
          // Add profile to payload
          if (id === ban.user_id) {
            ban.user_profile = profileRes.profile;
          } else if (id === ban.banned_by) {
            ban.banned_by_profile = profileRes.profile;
          }
        }
      } catch (error) {
        console.error(
          `Failed to fetch profile for user ${ban.user_id}:`,
          error
        );
      }
    }
  }

  return result.rows;
};
