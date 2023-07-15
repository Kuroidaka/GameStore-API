const DB = require('../../config/database');
const nodemailer = require('nodemailer');
const template = require("./template.html")
const service = require("../../service")

const mail = {
  send: async (req, res) => {
    const { customerName, customerEmail, subject, message, coupon, expirationDate, customCode } = req.body;

    try {
      let connection = await DB.getConnection();
      // Create a transporter for sending emails
      let code =''
      if(customCode) {
        code = customCode
      }
      else {
        const { discountCode } = await service.generateDiscountCode(8, connection, coupon, expirationDate)
        code = discountCode
      }

      if(code) {
        const sendMailStatus = await service.sendMail(customerName, customerEmail, subject, message, coupon, expirationDate, template, code)
        
        if(sendMailStatus.success) {
          console.log('Email sent: ' + sendMailStatus.message);
  
          return res.status(200).json({ message: sendMailStatus.message });
        }
        else {
          console.log(error);
          return res.status(500).json({ error: sendMailStatus.message });
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: sendMailStatus.message });

    }
  },
};

module.exports = mail;
