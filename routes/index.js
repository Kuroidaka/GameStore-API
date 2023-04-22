const test = require('./test.route')

function routes (app) {
    app.use('/', test)
}

module.exports = routes