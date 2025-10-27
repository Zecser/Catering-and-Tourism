import { Request, Response } from "express";
import { sendEmail } from "../utils/email";

export interface ContactFormBody {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export const handleContact = async (
  req: Request<{}, {}, ContactFormBody>,
  res: Response
): Promise<void> => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ message: "Name, email and message are required" });
    return;
  }

  try {
    await sendEmail(
      process.env.ADMIN_EMAIL as string,
      "New Contact Form Submission",
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\n\nMessage:\n${message}`,
      `<p><strong>Name:</strong> ${name}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Phone:</strong> ${phone || "N/A"}</p>
       <p><strong>Message:</strong><br>${message}</p>`
    );

    res.status(200).json({ message: "Email sent successfully!" });
    return;
  } catch (err) {
    console.error("Error sending contact email:", err);
    res.status(500).json({ message: "Failed to send email" });
    return;
  }
};
