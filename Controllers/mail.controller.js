const DB = require('../config/database');
const nodemailer = require('nodemailer');

const mail = { 
    send: async (req, res) => {
        const { customerName, customerEmail, subject, message } = req.body;

        // Create a transporter for sending emails
        const transporter = nodemailer.createTransport({
          service: 'pcanhgm@gmail.com', // e.g., Gmail, Yahoo, etc.
          auth: {
            user: process.env.MAIL_HOST,
            pass: process.env.MAIL_PASSWORD,
          },
        });
      
        // Define the email options
        const mailOptions = {
          from: 'pcanhgm@gmail.com',
          to: customerEmail,
          subject: subject,
          text: `Dear ${customerName},\n\n${message}`,
        };
      
        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred while sending the email.' });
          } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ message: 'Email sent successfully.' });
          }
        });
    
    },
   
}

module.exports = mail