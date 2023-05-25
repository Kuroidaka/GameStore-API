const express = require('express')
const verifyToken = require('../middleware/verifyToken')
const router = express.Router()
const auth = require('../Controllers/customer/authCustomer.controller')
const info = require('../Controllers/customer/info.controller')

router.post('/signup', auth.signUp)
router.post('/login', auth.login)
router.post('/changePassword', verifyToken, auth.changePassword)
router.post('/getInfo', info.getOne)
router.post('/update', info.update)

module.exports = router
