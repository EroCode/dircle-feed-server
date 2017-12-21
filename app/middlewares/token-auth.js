const jwt = require('jsonwebtoken')
const { secret } = require('../utils/config')

module.exports = async (ctx, next) => {
    if (ctx.headers['authorization']) {
        try {
            ctx.token = jwt.verify(ctx.headers['authorization'], secret)
        } catch (err) {
            ctx.throw(401)
            return
        }
    }
    await next()
}
