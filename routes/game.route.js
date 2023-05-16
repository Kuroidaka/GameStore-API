const express = require('express')
const game = require('../Controllers/game.controller')
const verifyToken = require('../middleware/verifyToken')
const router = express.Router()

router.post('/insert',verifyToken , game.insertGame)
router.get('/get', game.getGameList)
router.get('/getById', game.getGameById)
router.get("/getByName", game.getGameByName)
router.post('/delete', verifyToken, game.deleteGame)
router.post('/edit', verifyToken, game.editGame)
module.exports = router