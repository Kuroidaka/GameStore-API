const DB = require('../config/database');
const service = require('../service');

const verifyAdmin = async (req, res, next) => {
    const { username } = req.user;
    const { valid } = await service.isAdmin(username)
    if(valid){ 
        next()
    }else {
        res.status(401).json({msg : 'Access denied. User not authorized.'});
    }
}

module.exports = verifyAdmin;