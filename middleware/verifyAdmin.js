const DB = require('../config/database');

const verifyAdmin = async (req, res, next) => {
    const { username } = req.user;
    const [checkAdmin] = await DB.query('SELECT * FROM Admins WHERE username = ?', [username])
    if(checkAdmin.length >= 1){ 
        next()
    }else {
        res.status(401).json({msg : 'Access denied. User not authorized.'});
    }
}

module.exports = verifyAdmin;