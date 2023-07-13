const DB = require('./config/database');


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
    generateDiscountCode: async (length = 8) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let discountCode = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * chars.length);
          discountCode += chars.charAt(randomIndex);
        }
        return discountCode;
      }
}



module.exports = service;