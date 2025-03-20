export const sendEmail = async (to: string, subject: string, body: string): Promise<void> => {
    console.log(`Sending email to ${to}: ${subject} - ${body}`);

    // Simulate sending email
    return Promise.resolve();
  };