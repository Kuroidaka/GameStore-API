const express = require('express')
const tracking = require('../Controllers/tracking.controller')
const router = express.Router()

router.get('/get-track-list', tracking.getTrackList)

module.exports = router