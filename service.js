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
    }
}



module.exports = service;