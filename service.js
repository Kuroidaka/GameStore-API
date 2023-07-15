const DB = require('./config/database');
const nodemailer = require('nodemailer');

const service = {

    isAdmin: async (username) => {

        const [checkAdmin] = await DB.query('SELECT * FROM Admins WHERE username = ?', [username])
        if(checkAdmin.length >= 1){ 
            return { valid : true }
        }else {
            return { valid : false }
        }
    },
    isBanned: async (userID) => {
        const [checkBan] = await DB.query(
            `SELECT * FROM ${process.env.DATABASE_NAME}.banned_users WHERE user_id = ?`,
            [userID]
            );
    
        if (checkBan.length >= 1) {
        return { banned: true }
        }
        return { banned: false }
    },
    generateDiscountCode: async (length = 8, connection, amount, expiration = 30) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let discountCode = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        discountCode += chars.charAt(randomIndex);
      }
      try{
        if(discountCode) {
          await connection.beginTransaction();
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + expiration);

          await connection.query(` 
          INSERT INTO Discounts (discount_code, discount_amount, expiration_date)
          VALUES ('${discountCode}', '${amount}', '${expirationDate.toISOString().slice(0, 19).replace('T', ' ')}')
          `)
          // Commit the transaction
          await connection.commit();

          return { discountCode, msg: 'discount created successfully' }
        }
      }
      catch (err) {
          console.error(err);

          if (connection) {
              await connection.rollback();
          }
          return res.status(500).json({ msg: 'Server Error' })
      }finally {
          // Release the connection back to the pool
          if (connection) {
              connection.release();
          }
          }

    },
    getDiscountByCode: async (discountCode) => {
        const [discount] = await DB.query(
            `SELECT * FROM ${process.env.DATABASE_NAME}.Discounts WHERE discount_code = ?`,
            [discountCode]
        );
        if (discount.length === 0) { 
            return false;
        }

        return { expiration_date: discount[0].expiration_date, discount_amount: discount[0].discount_amount }
    },
    sendMail: async (customerName, customerEmail, subject, message, coupon, expirationDate, template, code ) => {
    
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
            html: template.coupon(customerName, message, coupon*100, expirationDate, code)
          };
    
          // Send the email
          const info = await transporter.sendMail(mailOptions);
          
          console.log('Email sent: ' + info.response);
          return { success: true, message: 'Email sent successfully.' }
        } catch (error) {
          return { success: false , message: `An error occurred while sending the email: ${error}` }
        }
    }
}



module.exports = service;