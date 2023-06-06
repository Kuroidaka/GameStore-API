const game = require('./game.route')
const admin = require('./admin.route')
const order = require('./order.route')
const customer = require('./customer.route')
const wishlist = require('./wishlist.route')
const file = require('./file.route')

function routes (app) {
    app.use('/game', game)
    app.use('/admin', admin)
    app.use('/order', order)
    app.use('/customer', customer)
    app.use('/wishlist', wishlist)
    app.use('/file', file)
}

module.exports = routes