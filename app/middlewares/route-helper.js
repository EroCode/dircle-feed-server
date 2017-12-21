const { forIn } = require('lodash/object')
const jwt = require('jsonwebtoken')
const { secret } = require('../utils/config')


const betterValidationResult = async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        if (error.name === 'ValidationError') {
            let msg = []
            const errors = error.errors
            for (const path in errors) {
                switch (errors[path].kind) {
                case 'required':
                    msg.push(`${path} is required.`)
                    break
                case 'user defined':
                    msg.push(errors[path].message)
                    break
                }
            }
            ctx.body = { ok: 'false', error: { messsage: msg.join('\n') } }
        } else {
            throw error
        }
    }
}

const paramCheck = function ({ require = [], allow = [], ignore }) {
    return async (ctx, next) => {
        const input = ctx.method === 'GET' ? ctx.query : ctx.request.body
        const result = {}
        let requiredCount = 0
        if (!ignore) {
            forIn(input, function (v, k) {
                if (require.includes(k)) {
                    requiredCount++
                    result[k] = v
                } else if (allow.includes(k)) {
                    result[k] = v
                }
            })
        } else {
            forIn(input, function (v, k) {
                if (require.includes(k)) {
                    requiredCount++
                    result[k] = v
                } else if (!(ignore.includes(k))) {
                    result[k] = v
                }
            })
        }
        if (requiredCount !== require.length) {
            ctx.throw(400)
            return
        } else {
            ctx.params = result
            await next()
        }
    }
}


const needAuth = async (ctx, next) => {
    if (ctx.headers['authorization']) {
        try {
            ctx.token = jwt.verify(ctx.headers['authorization'], secret)
        } catch (err) {
            ctx.throw(401)
            return
        }
        await next()
    } else ctx.throw(401)
}

module.exports = { needAuth, betterValidationResult, paramCheck }

