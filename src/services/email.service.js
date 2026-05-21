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
  const verifyURL = `https://web-shop-api.vercel.app/auth/verify-email/${token}`;

  await transporter.sendMail({
    from: `"The Pizza Hub" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify Your Email — The Pizza Hub",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #e53e3e;">🍕 Welcome to The Pizza Hub!</h2>
        <p>Hi <b>${name}</b>,</p>
        <p>Please verify your email by clicking the button below:</p>
        <a href="${verifyURL}" 
           style="background:#e53e3e; color:white; padding:12px 24px; 
                  text-decoration:none; border-radius:6px; display:inline-block; margin:16px 0;">
          Verify Email
        </a>
        <p>Link expire hoga <b>24 ghante</b> mein.</p>
        <p>Agar aapne register nahi kiya toh is email ko ignore karein.</p>
        <hr/>
        <small style="color:#999;">The Pizza Hub Team</small>
      </div>
    `,
  });
};

module.exports = { sendVerificationEmail };