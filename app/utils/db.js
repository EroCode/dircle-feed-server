const mongoose = require('mongoose')

const logger = require('../utils/logger')
const { dbUrl } = require('../utils/config')

mongoose.connect(dbUrl, { useMongoClient: true })
mongoose.Promise = global.Promise
const db = mongoose.connection

db.on('error', (_) => {
    logger.error(_)
    process.exit(1)
})

db.once('open', function () {
    logger.info('Connection to mongoDB has established!')
})

