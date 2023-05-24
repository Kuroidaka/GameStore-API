const game = require('./game.route')
const admin = require('./admin.route')
const order = require('./order.route')
const customer = require('./customer.route')

function routes (app) {
    app.use('/game', game)
    app.use('/admin', admin)
    app.use('/order', order)
    app.use('/customer', customer)
}

module.exports = routes