const express = require('express')
const mail = require('../Controllers/mail.controller')
const verifyToken = require('../middleware/verifyToken')
const verifyAdmin = require('../middleware/verifyAdmin')
const router = express.Router()

router.post('/send', mail.send)

module.exports = router