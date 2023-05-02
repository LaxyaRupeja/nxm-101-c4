const fs = require('fs');
const logger = (req, res, next) => {
    fs.appendFileSync("logs.txt", `METHOD ${req.method},User IP ${req.headers["user-agent"]},URL ${req.url}\n`)
    next()
}
module.exports = { logger }