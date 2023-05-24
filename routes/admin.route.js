const express = require('express')
const auth = require('../Controllers/authAdmin.controller')
const verifyToken = require('../middleware/verifyToken')
const verifyAdmin = require('../middleware/verifyAdmin')
const router = express.Router()

router.post('/signup', auth.signUp)
router.post('/login', auth.login)
router.post('/changePassword', verifyToken, verifyAdmin, auth.changePassword)

module.exports = router
