import mailQueue from "../queues/mailQueue.js";

export const addEmailToMailQueue = async (emailData) => {
  console.log("✅ Job added to Redis queue");
  console.log("initiating email sending process");

  try {
    await mailQueue.add(emailData);
    console.log("📥 Email job added to mail queue");
  } catch (error) {
    console.error("❌ Add email to mailQueue error", error);
  }
};
