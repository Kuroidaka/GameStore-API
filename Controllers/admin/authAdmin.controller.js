const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DB = require('../../config/database');


const auth = {
    signUp: async (req, res) => {
      const { username, email, password } = req.body;
      
      try {
        // check if user already exists
        const [existingUser] = await DB.query('SELECT * FROM Admins WHERE username = ?', [username]);
        console.log("existingUser",existingUser);
        if (existingUser.length > 0) {
          return res.status(404).json({msg : 'User already exists'});
        }

        // check if password is provided
        if (!password) {
          return res.status(400).json({msg : 'Password is required'});
        }
    
        // hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // insert the new user into the database
        const [newUser] = await DB.query('INSERT INTO Admins (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
    
        // generate a JSON web token for the new user
        const token = jwt.sign({ id: newUser.insertId, username, email }, 'your-secret-key', { expiresIn: '1h' });
        res.status(200).json({ token });
      } catch (error) {
        console.error('Error signing up: ', error);
        res.status(500).send('Error signing up');
      }
    },
    login : async (req, res) => {
      const { username, password } = req.body;

      try {
        const [result] = await DB.query('SELECT * FROM Admins WHERE username = ?', username) 

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
        const getCurrentPdQuery = `SELECT password FROM ${process.env.DATABASE_NAME}.Admins WHERE id = ?`
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
        await DB.query(`UPDATE ${process.env.DATABASE_NAME}.Admins SET password = ? WHERE id = ?`, [newPasswordHash, userId])

        return res.status(200).json({ message: 'Password updated successfully' });
      }
      catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Server error' });
      
      }
    },
    checkToken : async (req, res) => {
      const decode = req.user 
      if(decode) {
        return res.status(200).json({ valid: true, msg: "Token is valid" })
      }
    }
}



module.exports = auth;
