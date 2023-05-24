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
                return res.status(200).json({ msg: 'Game created successfully' });
            } catch (err) {
                console.error(err);
                return res.status(500).json({ msg: 'Server Error' });
            }
        }else {
            res.status(401).json({msg : 'Access denied. User not authorized.'});
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
            return res.status(500).json({ msg: 'Server Error' });
        }
    },
    getGameById: async (req, res) => {
        const query = "SELECT * FROM Games WHERE id = ?";
        try {
            const result = await DB.query(query, req.query.id);
            return res.status(200).json(result[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ msg: 'Server Error' });
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
            return res.status(500).json({ msg: 'Server Error' });
        }
    },
    deleteGame: async (req, res) => {

        const { username } = req.user;

        const [checkAdmin] = await DB.query(`SELECT * FROM ${process.env.DATABASE_NAME}.Admins WHERE username = ?`, [username])

        if(checkAdmin.length >= 1){ 
            const param = req.query;

            const { id } = param
            
            try {  

                const checkGameQuery = `SELECT * FROM ${process.env.DATABASE_NAME}.Games WHERE id = ?`;
                const [checkGame] = await DB.query(checkGameQuery, [id]);
              
                if(checkGame.length < 1) return res.status(404).json({ msg: 'Game not found' })
                else {
                    const query = `DELETE FROM ${process.env.DATABASE_NAME}.Games WHERE id=?`;
    
                    await DB.query(query, id);
                    return res.status(200).json({ msg: 'Delete successfully' });
                    
                }
            } catch (error) {
                console.error(err);
                return res.status(500).json({ msg: 'Server Error' });
            }
        }else {
            res.status(401).json({msg : 'Access denied. User not authorized.'});
        }

       
    },
    editGame: async (req, res) => {
        const { username } = req.user;
        // check admin account
        const [checkAdmin] = await DB.query(`SELECT * FROM ${process.env.DATABASE_NAME}.Admins WHERE username = ?`, [username])

        if(checkAdmin.length >= 1){ 
            const param = req.query
            const { id } = param
            // check game exist
            const checkGameQuery = `SELECT * FROM ${process.env.DATABASE_NAME}.Games WHERE id = ?`;
            const [checkGame] = await DB.query(checkGameQuery, [id]);

            if(checkGame.length < 1) return res.status(404).json({ msg: 'Game not found' })
            else {
                const json = req.body
               
                const keyList = Object.keys(json)
    
                const queryUpdate = keyList.map(key => {
                    if(key != 'id'){
                        return ` ${key} = '${json[key]}' `
                    }
                }).join(', ');
    
                // for (let i = 0; i < key.length; i++) {
                //     if (key[i] != 'id') {
                //         param = param + `${key[i]}=` + `"${json[key[i]]}"`
                //         console.log(param);
                //         if (i < key.length - 1) {
                //             param += ', '
                //         }
                //     }
                // }
                
                

                // update game
                const query = `update Games set ${queryUpdate} where id=${id}`
                try {
                    const result = await DB.query(query)
                    return res.status(200).json({ msg: 'successful update' })
                } catch (error) {
                    console.error(error)
                }

            }
           
        }
        else {
            res.status(401).json({msg : 'Access denied. User not authorized.'});
        }
    }
}

module.exports = game