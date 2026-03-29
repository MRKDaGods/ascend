import db from "@shared/config/db";
import { Events, publishEvent, SendEmailPayload } from "@shared/rabbitMQ";

export const sendEmail = async (
  to: string,
  subject: string,
  body: string
): Promise<void> => {
  console.log(`Sending email to ${to}: ${subject} - ${body}`);

  try {
    const emailPayload: SendEmailPayload = {
      to,
      subject,
      content: body,
    };

    await publishEvent(Events.EMAIL_SEND, emailPayload);
  } catch (error) {
    console.error("Failed to publish email send event:", error);
  }
};

export const checkProxyEmailExists = async (
  email: string
): Promise<boolean> => {
  const result = await db.query(
    "SELECT EXISTS(SELECT 1 FROM email_service.users WHERE email = $1)",
    [email]
  );
  return result.rows[0].exists;
}