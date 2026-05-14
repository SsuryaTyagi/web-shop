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
//  okipoklpo

const SendMailController = async (req, res) => {
  const { name, email, subject, message } = req.body;
 
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
 
  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: `"${name}" <${email}>`,              
      subject: subject,
      text: message,
      html: `
        <h3>New Contact Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });
 
    console.log(`Mail sent from: ${name} <${email}>`);
    return res.status(200).json({ success: true, message: "Email sent successfully!" });
 
  } catch (err) {
    console.error("Mail Error:", err);
    return res.status(500).json({ success: false, message: "Failed to send email" });
  }
};
 
module.exports = { SendMailController };