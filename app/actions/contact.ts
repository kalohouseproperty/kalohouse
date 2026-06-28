"use server";

import { sendContactFormEmail } from "@/lib/email";

export async function sendContactMessage(formData: {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}) {
  const { firstName, lastName, email, message } = formData;

  if (!firstName || !lastName || !email || !message) {
    return { error: "All fields are required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  try {
    await sendContactFormEmail({ firstName, lastName, email, message });
    return { success: "Message sent! We'll get back to you soon." };
  } catch (err) {
    console.error("Contact form error:", err);
    return { error: "Failed to send message. Please try again later." };
  }
}
