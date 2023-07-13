const DB = require('../../config/database');
const nodemailer = require('nodemailer');
const template = require("./template.html")

const mail = {
  send: async (req, res) => {
    const { customerName, customerEmail, subject, message, coupon, expirationDate } = req.body;

    try {
      // Create a transporter for sending emails
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "thomasjin38@gmail.com",
          pass: "esinuztkqktmrtdz",
        },
      });

      // Define the email options
      const mailOptions = {
        from: "thomasjin38@gmail.com",
        to: customerEmail,
        subject: subject,
        html: template.coupon(customerName, message, coupon*100, expirationDate)
      };

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      return res.status(200).json({ message: 'Email sent successfully.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while sending the email.' });
    }
  },
};

module.exports = mail;
