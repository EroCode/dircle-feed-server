const mongoose = require('mongoose')
const crypto = require('crypto')
const passwordValidator = require('password-validator')

const logger = require('../utils/logger')


// TODO: move password schema to config...
const passwordSchema = new passwordValidator()
passwordSchema.is().min(8)
    .is().max(50)
    .has().letters()
    .has().digits()

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true,
        unique: true,
        validate: {
            validator: _ => /^[_a-zA-Z][_a-zA-Z0-9]*$/.test(_),
            msg: 'User name is not valid',
        },
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: _ => /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(_),
            msg: 'Email is not valid',
        },
    },
    bio: String,
    name: {
        type: String,
        required: true,
    },
    salt: String,
    passwordHashed: {
        type: String,
        validate: { // setting a weak password leads to a empty filed value.
            validator: _ => _ !== '',
            msg: 'Password is too simple',
        },
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true,
    },
}, {
    timestamps: true,
})

// NOTE:saving salt & hash in this way is still so weak according to
// https://nakedsecurity.sophos.com/2013/11/20/serious-security-how-to-store-your-users-passwords-safely/

UserSchema.virtual('password').set(function (password) {
    // an empty passwordHashed can not be saved.
    if (!passwordSchema.validate(password)) {
        this.passwordHashed = ''
    } else {
        this.salt = Math.round((new Date().valueOf() * Math.random())) + ''
        this.passwordHashed = this.encryptPassword(password)
    }
})

UserSchema.methods = {
    encryptPassword: function (password) {
        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password).digest('hex')
        } catch (err) {
            logger.error(err)
            return ''
        }
    },
    authenticate: function (password) {
        return this.encryptPassword(password) === this.passwordHashed
    },
}

mongoose.model('User', UserSchema)

