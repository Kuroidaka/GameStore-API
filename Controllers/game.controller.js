const DB = require('../config/database');
const image = require('./file/image.controller');


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
    uploadGameFile: async (req, res) => {
        const { gameID } = req.query

        const connection = await DB.getConnection();

        try {
            await connection.beginTransaction()

            const listImageId = await image.upload(req, res) 
            
            if(listImageId.length > 0) {
                for(const imageID of listImageId) {
                    const query = "INSERT INTO FileLink (gameID, fileID) VALUES (?, ?)";
        
                    const result = await connection.query(query, [gameID, imageID]);

                    if (result[0].affectedRows !== 1) {
                        throw new Error(`Failed to Link image with ID: ${imageID}`);
                      }
                }
            }


            await connection.commit();

            return res.status(200).json({msg : 'File linked successfully'})

        } catch (error) {
            console.log(error)
        }

    },
    getGameList: async (req, res) => {
        const param = Number(req.query.limit)
        //if there limit the query will be "Select * from Games limit ?" else the query will be "SELECT * FROM Games"
        const query =param ?"Select * from Games limit ?": "SELECT * FROM Games";
        try {
            const [result] = await DB.query(query,param);
            console.log(result);

            for(let i = 0 ; i < result.length; i++) {
                const [imageList] = await DB.query(`
                    SELECT
                    img.filepath AS filepath
                    FROM Games c
                    LEFT JOIN FileLink fl ON fl.gameID = c.id
                    LEFT JOIN images img ON img.id = fl.fileID
                    where c.id = ${result[i].id}`
                );

                result[i].imageList = imageList;
            }

            return res.status(200).json(result);
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
        const query = `SELECT
                        g.id,
                        g.game_name,
                        g.release_date,
                        g.developer,
                        g.rating,
                        g.price,
                        g.genre,
                        g.platform,
                        g.description,
                        g.created_at,
                        g.updated_at,
                        MAX(img.filepath) AS filepath
                        
                    FROM Games g
                    JOIN FileLink fl
                        ON g.id = fl.gameID
                    JOIN images img 
                        on img.id = fl.fileID
                    
                    WHERE game_name LIKE '%${name}%'
                    
                    GROUP BY
                        g.id,
                        g.game_name,
                        g.release_date,
                        g.developer,
                        g.rating,
                        g.price,
                        g.genre,
                        g.platform,
                        g.description,
                        g.created_at,
                        g.updated_at`;
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

