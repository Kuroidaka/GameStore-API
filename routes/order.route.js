const express = require('express')

const verifyToken = require('../middleware/verifyToken')
const order = require('../Controllers/order.controller')
const verifyAdmin = require('../middleware/verifyAdmin')
const router = express.Router()

router.post('/book', verifyToken, order.booking)
router.post('/accept', verifyToken, verifyAdmin, order.accept)
router.post('/reject', verifyToken, verifyAdmin, order.reject)
router.get('/get', order.getListOrder)
router.get('/get-order-detail', order.getOrderDetail)
router.post('/edit-order-detail', verifyToken, verifyAdmin, order.editOrder)
router.get('/get-order-by-game', order.getOrderByGameId)


module.exports = router