require("dotenv").config();
const nodemailer = require("nodemailer");

async function testEmail() {
  console.log("Using EMAIL_USER:", process.env.EMAIL_USER);
  console.log("Using EMAIL_PASS:", process.env.EMAIL_PASS ? "Set (hidden)" : "Not Set");

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Missing EMAIL_USER or EMAIL_PASS in .env file");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Resume Builder" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // send to self
      subject: "Test Email from Resume Builder",
      text: "This is a test email to verify nodemailer is working.",
    });
    console.log("Success! Email sent: %s", info.messageId);
  } catch (err) {
    console.error("Failed to send email!");
    console.error(err);
  }
}

testEmail();
