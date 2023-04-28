const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DB = require('../config/database');


const auth = {
    signUp: async (req, res) => {
      const { username, email, password } = req.body;
      try {
        // check if user already exists
        const [existingUser] = await DB.query('SELECT * FROM Admins WHERE username = ?', [username]);
        console.log("existingUser",existingUser);
        if (existingUser.length > 0) {
          return res.status(400).send('User already exists');
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
        if (result.length === 0 || !await bcrypt.compare(password, result[0].password)) {
          res.status(401).send('Invalid credentials');
          return;
        }
    
        // generate a JSON web token for the user
        const token = jwt.sign({ username: result[0].username }, 'your-secret-key', { expiresIn: '1h' });
        return res.status(200).json({ token });
      
      } catch (error) {
        console.error('error retrieving user: ', error);
        res.status(500).send('Error logging in');
        return;
      }
    
    },
}



module.exports = auth;

