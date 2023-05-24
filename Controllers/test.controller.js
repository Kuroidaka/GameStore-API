// const DB = require('C:/Users/USER/GameStore-API/config/database.js')
// const test = { 
//     log: async (`req`, res) => {
        
//         return res.json('hello')
//     }
// }

// async function runQuery() {
//     try {
//         const [rows, fields] = await DB.query('SELECT * FROM Games');
//         console.log(rows);
//     } catch (error) {
//         console.error(error);
//     }
// }
// async function insertGame(game_name, release_date, developer, rating, price, genre, platform, description) {
//     const query = "INSERT INTO Games (game_name, release_date, developer, rating, price, genre, platform, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
//     const values = [game_name, release_date, developer, rating, price, genre, platform, description];

//     try {
//         const result = await DB.query(query, values);
//         console.log(`Inserted ${result[0].affectedRows} row(s)`);
//     } catch (err) {
//         console.error(err);
//     }
// }

// //insertGame('The Last of Us Part II', '2020-06-19', 'Naughty Dog', 4.8, 59.99, 'Action', 'PlayStation', 'Survive a post-apocalyptic world as Ellie in this highly anticipated sequel.')
// //runQuery();

// module.exports = test
