import { SendEmailPayload } from "@shared/rabbitMQ";
import { getSystemUserEmail, sendEmail } from "../services/emailService";

// Sends email using the system user
export const handleSendEmail = async (payload: SendEmailPayload) => {
    const sender = await getSystemUserEmail();
    const { to, subject, content } = payload;

    await sendEmail(sender, to, subject, content);
};