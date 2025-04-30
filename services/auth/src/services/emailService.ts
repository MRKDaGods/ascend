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
