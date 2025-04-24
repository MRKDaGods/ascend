import db from "@shared/config/db";

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
