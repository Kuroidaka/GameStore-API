const express = require('express')
const auth = require('../Controllers/authAdmin.controller')
const router = express.Router()

router.post('/signup', auth.signUp)
router.post('/login', auth.login)

module.exports = router