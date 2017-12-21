const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { pick } = require('lodash/object')
const { secret } = require('../utils/config')
const { ok, logger } = require('../utils')
const User = mongoose.model('User')
function makeJwt(_id) {
    return jwt.sign({ _id }, secret, { expiresIn: '1h' })
}

module.exports = {
    $login: async (username, password) => {
        const user = await User.findOne({ username })
        if (!user) return ok(false, 'User not found')
        if (!user.authenticate(password)) return ok(false, 'Incorrect password')
        return ok({ token: makeJwt(user._id) })
    },
    $register: async (obj) => {
        try {
            let user = new User(obj)
            await user.save()
            return ok({
                token: makeJwt(user._id),
                ...pick(user.toObject(), [
                    'username',
                    'email',
                    'name',
                    '_id',
                    'createdAt',
                    'isAdmin',
                    'bio',
                ]),
            })
        } catch (err) {
            if (err.name == 'MongoError'
       && err.errmsg.indexOf('duplicate key') > -1) {
                return ok(false, 'username exists')
            } else throw err
        }
    },
}

