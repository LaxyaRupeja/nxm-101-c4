const rateLimit = require('express-rate-limit')
const limiterRate = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message:
        'Max Request Limit Has Been Exceeded',
    standardHeaders: true,
    legacyHeaders: false,
})
module.exports = { limiterRate }