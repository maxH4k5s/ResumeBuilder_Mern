const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Needs to be an App Password if using Gmail
      },
    });

    // Verify the connection
    try {
      await transporter.verify();
      console.log("Transporter verified successfully");
    } catch (verifyError) {
      console.error("Transporter verification failed:", verifyError.message);
      throw new Error("Email service connection failed");
    }

    const mailOptions = {
      from: `"Resume Builder" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
    console.error("Full error details:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
