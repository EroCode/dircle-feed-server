const Koa = require('koa');

const logger  = require('./utils/logger');
const loggerMiddleware = require('./middlewares/logger');

require('./utils/db'); //make a connection to database , application will terminate if error occurrs 

const app = new Koa();

app.use(loggerMiddleware);
app.use(ctx => ctx.body = 'Hello Koa');

app.listen(3000);
logger.info("Listen @ 3000");


