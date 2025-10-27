import nodemailer from "nodemailer";


export const sendEmail = async (
    to: string,
    subject: string,
    text: string,
    html?: string
) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.ADMIN_EMAIL) {
            throw new Error("Missing EMAIL_USER, EMAIL_PASS, or ADMIN_EMAIL in environment variables");
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const info = await transporter.sendMail({
            from: `"GOOD TASTE CATERS " <${process.env.EMAIL_USER}>`,
            to: to ?? process.env.ADMIN_EMAIL,
            subject,
            text,
            html,
        });

        console.log("📧 Email sent:", info.messageId);
        return info;
    } catch (err) {
        console.error("Error sending email:", err);
        throw err;
    }
};


export const sendOTPEmail = async (email: string, otp: string) => {
    const subject = "Password Reset OTP";
    const text = `Your password reset OTP is: ${otp}\n\nThis OTP is valid for 10 minutes. Please do not share this OTP with anyone.`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset OTP</h2>
            <p>Your password reset OTP is:</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #333; border-radius: 5px; margin: 20px 0;">
                ${otp}
            </div>
            <p>This OTP is valid for 10 minutes. Please do not share this OTP with anyone.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
        </div>
    `;

    await sendEmail(email, subject, text, html);
};

