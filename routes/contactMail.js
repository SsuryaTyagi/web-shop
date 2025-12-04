const express = require("express");
const nodemailer = require("nodemailer");

const sendMaile = express.Router();

sendMaile.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Create a transporter for SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,

      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();
    console.log("Server is ready to take our messages");

    const info = await transporter.sendMail({
      from: `${name}`, // sender address
      to: process.env.SMTP_USER,  // list of receivers
      replyTo: `${name} <${email}>`,
      subject: `${subject}`, // Subject line
      text: `${message}`, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return res.json({ success: true, message: "Email sent successfully!" });
  } catch (err) {
    console.error("Error while sending mail", err);
    return res.status(500).json({ success: false, error: "Email failed!" });
  }
});

module.exports = sendMaile;
