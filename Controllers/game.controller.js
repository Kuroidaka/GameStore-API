const DB = require('../config/database')

const game = { 
    insertGame: async (req, res) => { 

        const { username } = req.user;

        const [checkAdmin] = await DB.query('SELECT * FROM Admins WHERE username = ?', [username])

        if(checkAdmin.length >= 1){ 
            const { game_name, release_date, developer, rating, price, genre, platform, description } = req.body;
            const query = "INSERT INTO Games (game_name, release_date, developer, rating, price, genre, platform, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            const values = [game_name, release_date, developer, rating, price, genre, platform, description];
        
            try {
                const result = await DB.query(query, values);
                console.log(`Inserted ${result[0].affectedRows} row(s)`);
                return res.status(200).json({ message: 'Game created successfully' });
            } catch (err) {
                console.error(err);
                return res.status(500).json({ message: 'Server Error' });
            }
        }else {
            res.status(401).send('Access denied. User not authorized.');
        }
    },
    getGameList: async (req, res) => {
        const param = Number(req.query.limit)
        //if there limit the query will be "Select * from Games limit ?" else the query will be "SELECT * FROM Games"
        const query =param ?"Select * from Games limit ?": "SELECT * FROM Games";
        try {
            const result = await DB.query(query,param);
            console.log(result);
            return res.status(200).json(result[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server Error' });
        }
    },
    getGameById: async (req, res) => {
        const query = "SELECT * FROM Games WHERE id = ?";
        try {
            const result = await DB.query(query, req.query.id);
            return res.status(200).json(result[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server Error' });
        }
    },
    getGameByName: async (req, res) => {
        const name = req.query.name
        const query = "SELECT * FROM Games WHERE game_name = ?";
        try {
            const result = await DB.query(query,name);
            return res.status(200).json(result[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server Error' });
        }
    }
}

module.exports = game