// src/services/email.service.js
const nodemailer = require("nodemailer");

// ✅ Transporter define karo
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendVerificationEmail = async (email, name, token) => {
  const verifyURL = `https://web-shop-frontend.vercel.app/verify-email/${token}`;

  await transporter.sendMail({
    from: `"The Pizza Hub" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify Your Email - The Pizza Hub",
    html: `
      <div style="font-family: Arial; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 12px;">
        <h1 style="color:#E33B32;">🍕 The Pizza Hub</h1>
        <h2 style="color:#333;">Hello ${name}!</h2>
        <p style="color:#555; font-size:16px;">
          Thank you for registering. Please verify your email address 
          to activate your account.
        </p>
        <div style="text-align:center; margin: 30px 0;">
          <a href="${verifyURL}" 
             style="background:#E33B32; color:white; padding:14px 32px; 
                    border-radius:8px; text-decoration:none; 
                    font-size:16px; font-weight:bold;">
            Verify Email
          </a>
        </div>
        <p style="color:#999; font-size:13px;">
          This link will expire in 24 hours.
        </p>
        <p style="color:#999; font-size:13px;">
          If you did not create an account, please ignore this email.
        </p>
        <hr style="border:none; border-top:1px solid #eee; margin-top:20px;" />
        <p style="color:#ccc; font-size:12px; text-align:center;">
          © 2025 The Pizza Hub. All rights reserved.
        </p>
      </div>
    `,
  });
};

module.exports = { sendVerificationEmail }; 