const game = require('./game.route')
const admin = require('./admin.route')

function routes (app) {
    app.use('/game', game)
    app.use('/admin', admin)

}

module.exports = routes