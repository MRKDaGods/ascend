import db from "@shared/config/db";
import bcrypt from "bcryptjs";

export const createUser = async (email: string, pwd: string, name: string) => {
  const existingEmail = await db.query(
    "SELECT * FROM email_service.users WHERE email = $1",
    [email]
  );

  if (existingEmail.rows.length > 0) {
    throw new Error("Email already exists.");
  }

  const pwdHash = await bcrypt.hash(pwd, 10);
  await db.query(
    "INSERT INTO email_service.users (email, pwd, name) VALUES ($1, $2, $3)",
    [email, pwdHash, name]
  );
};

export const sendEmail = async (
  sender: string,
  email: string,
  subject: string,
  content: string
) => {
  const existingEmail = await db.query(
    "SELECT * FROM email_service.users WHERE email = $1",
    [email]
  );

  if (existingEmail.rows.length === 0) {
    throw new Error("Email not found.");
  }

  // Verify the sender's email
  const existingSender = await db.query(
    "SELECT * FROM email_service.users WHERE email = $1",
    [sender]
  );

  if (existingSender.rows.length === 0) {
    throw new Error("Sender email not found.");
  }

  // Insert the email into the database
  await db.query(
    "INSERT INTO email_service.emails (sender, email, subject, content) VALUES ($1, $2, $3, $4)",
    [sender, email, subject, content]
  );
};

export const getEmails = async (email: string) => {
  const existingEmail = await db.query(
    "SELECT * FROM email_service.users WHERE email = $1",
    [email]
  );

  if (existingEmail.rows.length === 0) {
    throw new Error("Email not found.");
  }

  // Get the emails for the user
  const emails = await db.query(
    "SELECT * FROM email_service.emails WHERE email = $1 ORDER BY created_at DESC",
    [email]
  );

  return emails.rows;
};

export const findUser = async (email: string) => {
  const existingEmail = await db.query(
    "SELECT * FROM email_service.users WHERE email = $1",
    [email]
  );

  if (existingEmail.rows.length === 0) {
    throw new Error("Email not found.");
  }

  return existingEmail.rows[0];
};

export const deleteEmail = async (emailId: number, owner: string) => {
  const email = await db.query(
    "SELECT * FROM email_service.emails WHERE id = $1 AND email = $2",
    [emailId, owner]
  );

  if (email.rows.length === 0) {
    throw new Error("Email not found.");
  }

  await db.query("DELETE FROM email_service.emails WHERE id = $1", [emailId]);
};

export const ensureSystemUserExists = async () => {
  const email = process.env.ASCEND_ADMIN_EMAIL;
  const name =
    process.env.ASCEND_ADMIN_FIRST_NAME +
    " " +
    process.env.ASCEND_ADMIN_LAST_NAME;
  const pwd = process.env.ASCEND_ADMIN_PASSWORD;

  if (!email || !name || !pwd) {
    throw new Error(
      "Missing required environment variables for system user creation"
    );
  }

  try {
    await createUser(email, pwd, name);
  } catch (error) {}
};

export const getSystemUserEmail = async () => {
  const email = process.env.ASCEND_ADMIN_EMAIL;
  if (!email) {
    throw new Error("ASCEND_ADMIN_EMAIL is not defined");
  }

  // Check if the email exists in the database
  const result = await db.query(
    "SELECT * FROM email_service.users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("System user email not found in the database");
  }

  return email;
};
