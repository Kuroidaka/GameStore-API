require("dotenv").config();
const express = require("express")
const cors = require("cors")
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const morgan = require('morgan')
const DB = require('./config/database')
const routes = require('./routes/index')


const app = express()

app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);
app.use(cors()) 
app.use(cookieParser())
app.use(morgan('dev'))
app.use(express.json())

routes(app)

// app.get('/', async (req, res) => {
//     try {
//         const [rows, fields] = await DB.query('SELECT * FROM Games');
//         res.json(rows);
//       } catch (err) {
//         console.error(err);
//         res.status(500).send('Internal server error');
//       }
// })

const port = process.env.SERVER_PORT || 8000; 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
