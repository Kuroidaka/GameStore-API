
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DB = require('../../config/database');

const auth = {
    signUp: async (req, res) => {
      const { username, email, password } = req.body;
      try {
        // check if user already exists
        const [existingUser] = await DB.query(
          `
          SELECT * 
          FROM ${process.env.DATABASE_NAME}.Users 
          WHERE username = ?
          OR email = ?`, 
          [username, email]);
          
        if (existingUser.length > 0) {
          return res.status(404).json({msg : 'User already exists'});
        }
    
        // hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // insert the new user into the database
        const [newUser] = await DB.query(`INSERT INTO ${process.env.DATABASE_NAME}.Users (username, email, password) VALUES (?, ?, ?)`, [username, email, hashedPassword]);
    
        // generate a JSON web token for the new user
        console.log("newUser.insertId", newUser.insertId);
        const token = jwt.sign({ id: newUser.insertId, username, email }, 'your-secret-key', { expiresIn: '1h' });
        res.status(200).json({ token });
      } catch (error) {
        console.error('Error signing up: ', error);
        res.status(500).json('Error signing up');
      }
    },
    login : async (req, res) => {
      const { username, password } = req.body;

      try {
        const [result] = await DB.query(`SELECT * FROM ${process.env.DATABASE_NAME}.Users WHERE username = ?`, username) 

        // check if the user exists and their password is correct
        if (result.length === 0 ) {
          return res.status(404).json({msg : 'Account does not exist'});
          
        }

        if (!await bcrypt.compare(password, result[0].password)) {
          return res.status(401).json({msg : 'Password is incorrect'});
          
        }
    
        // generate a JSON web token for the user
        const token = jwt.sign({ username: result[0].username, id: result[0].id }, 'your-secret-key', { expiresIn: '1h' });
        return res.status(200).json({ token });
      
      } catch (error) {
        console.error('error retrieving user: ', error);
        return res.status(500).send('Error logging in');
        
      }
    
    },
    changePassword : async (req, res) => { 
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id; 

      try {
          // Fetch the current password hash from the database
        const getCurrentPdQuery = `SELECT password FROM ${process.env.DATABASE_NAME}.Users WHERE id = ?`
        const getCurrentPdData = [userId]
        const [result] = await DB.query(getCurrentPdQuery, getCurrentPdData)

        if (result.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        const currentHashedPassword = result[0].password;
          
        // Compare the provided current password with the hash from the database
        const isMatch = await bcrypt.compare(currentPassword, currentHashedPassword)
    
        if (!isMatch) {
          return res.status(401).json({ error: 'Invalid current password' });
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
    getUserJoinToday : async (req, res ) => {
      try {
        const [result] = await DB.query(`
        SELECT
            (SELECT COUNT(id) FROM GAMESTORE.Users WHERE DATE(created_at) = CURDATE()) as dataUserToday,
            COUNT(id) as totalUsers
        FROM
            GAMESTORE.Users;
    
      
        `)
        let Increase = false;
        let percent = 0;
        const {dataUserToday, totalUsers} = result[0]

        if(dataUserToday > 0) {
          Increase = true
          percent = (dataUserToday / totalUsers) * 100
        }

        return res.status(200).json({data: dataUserToday, increase: Increase, percent: percent})
      } catch (error) {
        console.log(error)
        return res.status(500).json({msg: 'Server Error'})
      }
    },
    ban : async (req, res) => {
      const { id:adminID } = req.user;

      try {
        const {id:userID} = req.query;
        const { reason } = req.body

        const [checkUser] = await DB.query(`SELECT * FROM ${process.env.DATABASE_NAME}.Users WHERE id = ?`, [userID])
        if(checkUser.length < 1) return res.status(404).json({msg: 'User not found'})

        const [checkBan] = await DB.query(`SELECT * FROM ${process.env.DATABASE_NAME}.banned_users WHERE user_id = ?`, [userID])
        if(checkBan.length >= 1) return res.status(404).json({msg: 'User already banned'})

        const [result] = await DB.query(`INSERT INTO ${process.env.DATABASE_NAME}.banned_users (user_id, banned_by, reason) VALUES (?, ?, ?)`, [userID, adminID, reason])
        return res.status(200).json({msg: 'Ban successfully'})
        
      } catch (error) {
        console.log(error)
        return res.status(500).json({msg: 'Server Error'})
      }
    },
    unBan: async (req, res) => {
      const { id: adminID } = req.user;
    
      try {
        const { id: userID } = req.query;
    
        const [checkBan] = await DB.query(
          `SELECT * FROM ${process.env.DATABASE_NAME}.banned_users WHERE user_id = ?`,
          [userID]
        );
        
        if (checkBan.length < 1) {
          return res.status(404).json({ msg: 'User is not banned' });
        }
    
        await DB.query(
          `DELETE FROM ${process.env.DATABASE_NAME}.banned_users WHERE user_id = ?`,
          [userID]
        );
    
        return res.status(200).json({ msg: 'User unbanned successfully' });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Server Error' });
      }
    },
    getListBanned : async (req, res) => { 
      const { id: adminID } = req.user;
    
      try {
    
        const [checkBan] = await DB.query(
          `SELECT 
            b.id,
            b.user_id,
            b.banned_on,
            b.banned_by,
            b.reason,
            u.username,
            u.display_name,
            u.email,
            u.phone,
            u.address,
            u.total_points,
            u.subscription_status,
            u.created_at,
            u.updated_at
        FROM ${process.env.DATABASE_NAME}.banned_users b
        JOIN ${process.env.DATABASE_NAME}.users u on b.user_id = u.id`
        );
        
        if (checkBan.length < 1) {
          return res.status(404).json({ msg: 'No User Founded' });
        }
   
    
        return res.status(200).json(checkBan);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Server Error' });
      }
      
    }
    
}



module.exports = auth;

