const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DB = require('../../config/database');
const { v4: uuidv4 } = require('uuid');

const customer = {
    changePassword : async (req, res) => { 
        const { newPassword } = req.body;
  
        const userId = req.query.userID

        console.log("new password", newPassword)
  
        try {
            // Fetch the current password hash from the database
          const getCurrentPdQuery = `SELECT password FROM ${process.env.DATABASE_NAME}.Users WHERE id = ?`
          const getCurrentPdData = [userId]
          const [result] = await DB.query(getCurrentPdQuery, getCurrentPdData)
  
          if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
          }
  
          // Hash the new password
          const newPasswordHash = await bcrypt.hash(newPassword, 10)
  
            // Update the password in the database
          await DB.query(`UPDATE ${process.env.DATABASE_NAME}.Users SET password = ? WHERE id = ?`, [newPasswordHash, userId])
  
          return res.status(200).json({ message: 'Password updated successfully' });
        }
        catch (error) {
          console.log(error)
          return res.status(500).json({ error: 'Server error' });
        
        }
    },
    getCustomerInfo: async (req, res) => {
      const { userID } = req.query;

      try {

        let query = `SELECT u.id,
                    u.username,
                    u.display_name,
                    u.email,
                    u.phone,
                    u.address,
                    u.total_points,
                    u.subscription_status,
                    u.gender,
                    u.birth_date,
                    password
            From ${process.env.DATABASE_NAME}.Users u
            WHERE id = ?
            `
        const [result] = await DB.query(
            query,
            [userID]
        )

        if (result.length === 0) {
            return res.status(404).json({ msg: "user not found" })
        }

        return res.status(200).json(result[0])

      } catch (error) {
          return res.status(500).json({ msg: 'Error Server' })
      }

  },
}



module.exports = customer;
