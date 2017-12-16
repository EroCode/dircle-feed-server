const logger = require('../utils/logger');

module.exports = async (ctx,next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  logger.info(`[${ctx.status}] ${ctx.method} - ${ctx.path} - ${ms}ms`);
};
