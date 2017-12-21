const mongoose = require('mongoose')
const { pick } = require('lodash/object')
const { secret } = require('../utils/config')
const { ok, logger } = require('../utils')
const User = mongoose.model('User')

function _pickUserObj(obj) {
    return pick(obj, [
        '_id',
        'email',
        'username',
        'bio',
        'name',
        'createdAt',
        'updatedAt',
        'isAdmin',
    ])
}

const $ = {
    get: async (_id) => {
        const user = await User.findById(_id)
        if (user) return _pickUserObj(user)
        else return null
    },
    $changePassword: async (_id, newPassword, oldPassword = null) => {
    // 两种用途，管理员直接修改别人的密码(isAdmin)|用户需要验证自己的密码来修改自己的密码
        let user = await User.findById(_id)
        if (!user) return ok(false, 'User not found')
        if (oldPassword && !user.authenticate(oldPassword)) return ok(false, 'Wrong password')
        user.password = newPassword
        user = await user.save()
        return ok({ 'updatedAt': user.updatedAt })
    },
    $update: async (_id, info) => _pickUserObj(await User.findOneAndUpdate({
        _id,
    }, info,
    { 'new': true, 'runValidators': true })),
    $info: async (token) => {
        const user = await $.get(token._id)
        if (!user) {
            logger.error(`Something was wrong with the token system! ${token}`)
            // should never happen
            return ok(false, 'user not found.')
        }
        return ok(user)
    },
}

module.exports = $
