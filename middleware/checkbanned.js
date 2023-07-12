const DB = require('../config/database');
const service = require('../service');

const checkBannedUser = async (req, res, next) => {
  const { id: userID, username } = req.user;

  try {
    
    const { valid: validAdmin } = await service.isAdmin(username)

    if(validAdmin) return next();

    const { banned } = await service.isBanned(userID)
    if(banned) return res.status(401).json({msg : 'Account is banned'});
 

    // User is not banned, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = checkBannedUser;
