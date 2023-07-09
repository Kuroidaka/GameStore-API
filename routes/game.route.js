const express = require('express')
const game = require('../Controllers/game.controller')
const verifyToken = require('../middleware/verifyToken')
const verifyAdmin = require('../middleware/verifyAdmin')
const router = express.Router()

router.post('/insert', verifyToken, verifyAdmin, game.insertGame)
router.get('/get', game.getGameList)
router.get('/getById', game.getGameById)
router.get("/getByName", game.getGameByName)
router.post('/delete', verifyToken, game.deleteGame)
router.post('/edit', verifyToken, game.editGame)
router.get('/get-count-game', game.getTotalGame)

module.exports = router