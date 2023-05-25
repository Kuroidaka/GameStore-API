const express = require('express')

const verifyToken = require('../middleware/verifyToken')
const wishList = require('../Controllers/customer/wishList.controller')
const router = express.Router()

router.post('/add', verifyToken, wishList.add)
router.post('/remove', verifyToken, wishList.remove)


module.exports = router