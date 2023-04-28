const game = require('./game.route')

function routes (app) {
    app.use('/game', game)
}

module.exports = routes