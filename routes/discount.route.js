const express = require('express')
const discount = require('../Controllers/discount.controller')
const verifyToken = require('../middleware/verifyToken')
const verifyAdmin = require('../middleware/verifyAdmin')
const router = express.Router()


router.post('/generate', verifyToken, verifyAdmin, discount.generate)
router.post('/apply', discount.applyDiscountCode)


module.exports = router
