const express = require('express')
const auth = require('../Controllers/customer/authCustomer.controller')
const verifyToken = require('../middleware/verifyToken')
const router = express.Router()

router.post('/signup', auth.signUp)
router.post('/login', auth.login)
router.post('/changePassword', verifyToken, auth.changePassword)

module.exports = router
