const { pick } = require('lodash/object')
const Router = require('koa-router')

const { paramCheck, needAuth, betterValidationResult } = require('../middlewares/route-helper')

const authController = require('../controllers/auth.v1')
const userController = require('../controllers/user.v1')


const mainRouter = new Router({ prefix: '/v1' })
const userRouter = new Router()
const authRouter = new Router()


authRouter.post('/login',
    paramCheck({ require: ['username', 'password'] }),
    async ctx => ctx.body = await authController.$login(ctx.params.username, ctx.params.password)
)

authRouter.post('/register',
    paramCheck({
        require: ['username', 'password', 'email', 'name'],
        allow: ['bio'],
    }),
    betterValidationResult,
    async ctx => ctx.body = await authController.$register(ctx.params)
)

mainRouter.use('/auth', authRouter.routes())


userRouter.use(needAuth).get('/info',
    async ctx => ctx.body = await userController.$info(ctx.token)
).post('/changePassword',
    paramCheck({ require: ['oldPassword', 'newPassword'] }),
    betterValidationResult,
    async ctx => ctx.body = await userController.$changePassword(ctx.token._id, ctx.params.newPassword, ctx.params.oldPassword)
).put('/',
    paramCheck({ allow: ['email', 'name', 'bio'] }),
    betterValidationResult,
    async ctx => ctx.body = await userController.$update(ctx.token._id, ctx.params)
)


mainRouter.use('/user', userRouter.routes())

module.exports = mainRouter
