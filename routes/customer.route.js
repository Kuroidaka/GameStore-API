const express = require('express')
const verifyToken = require('../middleware/verifyToken')
const router = express.Router()
const auth = require('../Controllers/customer/authCustomer.controller')
const info = require('../Controllers/customer/info.controller')
const verifyAdmin = require('../middleware/verifyAdmin')

router.post('/signup', auth.signUp)
router.post('/login', auth.login)
router.post('/changePassword', verifyToken, auth.changePassword)
router.post('/getInfo', info.getOne)
router.post('/update', info.update)
router.post('/create', verifyToken, verifyAdmin, info.createCustomerInfo)
router.get('/get-user-join-today', auth.getUserJoinToday)
router.get('/get-user-join-month', info.getTotalUserByMonth)

module.exports = router
