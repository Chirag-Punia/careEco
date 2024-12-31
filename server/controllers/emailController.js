import transporter from "../config/mailer.js";

export const sendEmail = async (req, res) => {
  const { name, email, message, businessName } = req.body;

  try {
    const website = await Website.findOne({ businessName });
    if (!website) {
      return res.status(404).json({ success: false, message: "Website not found" });
    }

    const recipientEmail = website.email;

    if (!recipientEmail) {
      return res.status(400).json({ success: false, message: "Email address not found" });
    }

    const mailOptions = {
      from: process.env.XEMAIL,
      to: recipientEmail,
      subject: "New Contact Form Message",
      text: `You have a new message from ${name} (${email}):\n\n${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ success: false, message: "Error sending email" });
      }
      res.status(200).json({ success: true, message: "Email sent successfully" });
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
