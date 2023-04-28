const express = require('express')
const game = require('../Controllers/game.controller')
const router = express.Router()

router.post('/insert', game.insertGame)
router.get('/get', game.getGameList)
router.get('/getById', game.getGameById)
module.exports = router