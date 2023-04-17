require("dotenv").config();
const express = require("express")
const cors = require("cors")
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const morgan = require('morgan')

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

app.get('/', (req, res) => {
    res.send("hello dawworald")
})

const port = process.env.SEVER_PORT
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})