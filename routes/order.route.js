const express = require('express')

const verifyToken = require('../middleware/verifyToken')
const order = require('../Controllers/order.controller')
const verifyAdmin = require('../middleware/verifyAdmin')
const router = express.Router()

router.post('/book', verifyToken, order.booking)
router.post('/accept', verifyToken, verifyAdmin, order.accept)


module.exports = router