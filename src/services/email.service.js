// src/services/email.service.js
const nodemailer = require("nodemailer");

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

  try {
    await transporter.sendMail({
      from: `"The Pizza Hub" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify Your Email - The Pizza Hub",
      text: `Hello ${name}, please verify your email by visiting: ${verifyURL}. This link expires in 24 hours.`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Your Email</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f4f4f5; font-family: Arial, Helvetica, sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding: 32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">

                <!-- Header banner -->
                <tr>
                  <td style="background-color:#E33B32; padding:28px 24px; text-align:center;">
                    <img
                      src="https://ik.imagekit.io/gb1lyvp8q/The%20pizza%20hub/logo/logo_two.png"
                      alt="The Pizza Hub"
                      width="56"
                      style="display:block; margin:0 auto 10px; border-radius:8px;"
                    />
                    <p style="margin:0; color:#ffffff; font-size:14px; font-weight:600; letter-spacing:0.4px; text-transform:uppercase;">
                      The Pizza Hub
                    </p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:36px 32px 24px;">
                    <h1 style="margin:0 0 16px; color:#1a1a1a; font-size:22px; font-weight:700;">
                      Hi ${name}, confirm your email
                    </h1>
                    <p style="margin:0 0 24px; color:#555555; font-size:15px; line-height:1.6;">
                      Thanks for creating an account with The Pizza Hub. Please confirm this is your email address so we can activate your account and get you ordering.
                    </p>

                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
                      <tr>
                        <td align="center" style="border-radius:10px; background-color:#E33B32;">
                          <a href="${verifyURL}"
                             style="display:inline-block; padding:14px 36px; font-size:15px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:10px;">
                            Verify Email Address
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 8px; color:#999999; font-size:13px; line-height:1.6;">
                      This link expires in 24 hours. If the button above doesn't work, copy and paste this link into your browser:
                    </p>
                    <p style="margin:0 0 24px; word-break:break-all;">
                      <a href="${verifyURL}" style="color:#E33B32; font-size:13px;">${verifyURL}</a>
                    </p>

                    <p style="margin:0; color:#999999; font-size:13px; line-height:1.6;">
                      Didn't create this account? You can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:0 32px;">
                    <hr style="border:none; border-top:1px solid #eeeeee; margin:0;" />
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:20px 32px 28px; text-align:center;">
                    <p style="margin:0; color:#bbbbbb; font-size:12px; line-height:1.6;">
                      &copy; 2025 The Pizza Hub. All rights reserved.<br />
                      Delhi, India
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `,
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

module.exports = { sendVerificationEmail };