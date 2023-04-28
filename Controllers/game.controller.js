const DB = require('../config/database')
const test = { 
    log: async (req, res) => {
        
        return res.json('hello')
    },
    insertGame: async (req, res) => { 

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
    },
    getGameList: async (req, res) => {
        const query = "SELECT * FROM Games";
        try {
            const result = await DB.query(query);
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
    }
}



//insertGame('The Last of Us Part II', '2020-06-19', 'Naughty Dog', 4.8, 59.99, 'Action', 'PlayStation', 'Survive a post-apocalyptic world as Ellie in this highly anticipated sequel.')
//runQuery();

module.exports = test