const express = require('express')
const auth = require('../Controllers/admin/authAdmin.controller')
const customer = require('../Controllers/admin/customer.controller')
const verifyToken = require('../middleware/verifyToken')
const verifyAdmin = require('../middleware/verifyAdmin')
const router = express.Router()

router.post('/signup', auth.signUp)
router.post('/login', auth.login)
router.post('/changePassword', verifyToken, verifyAdmin, auth.changePassword)
router.post('/check-token', verifyToken, verifyAdmin, auth.checkToken)

// customer
router.post('/change-customer-Password', verifyToken, verifyAdmin, customer.changePassword)
router.get('/get-customer-info', verifyToken, verifyAdmin, customer.getCustomerInfo)


module.exports = router
