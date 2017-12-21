const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const logger = require('./utils/logger')
const loggerMiddleware = require('./middlewares/logger')
require('./utils/db') // make a connection to database , application will terminate if error occurrs
require('./models')
const routeV1 = require('./routes/v1')

const app = new Koa()
app.use(loggerMiddleware)
app.use(bodyParser({ enableTypes: ['json'] }))
app.use(routeV1.routes())
app.listen(3000)
logger.info('Listen @ 3000')

