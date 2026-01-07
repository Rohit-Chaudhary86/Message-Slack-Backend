import mailer from "../config/mailConfig.js";
import mailQueue from "../queues/mailQueue.js";

mailQueue.process(async (job) => {
  const emailData = job.data;
  console.log("🧵 [MAIL PROCESSOR] Processing email:", emailData);

  try {
    const response = await mailer.sendMail(emailData);
    console.log("🧵 [MAIL PROCESSOR] Email sent:", response.messageId);
    return true; // job successful
  } catch (error) {
    console.error("❌ [MAIL PROCESSOR] Email failed:", error);
    throw error; // IMPORTANT: lets Bull mark job as failed
  }
});
