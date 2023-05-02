const jwt = require('jsonwebtoken');
const authe = (req, res, next) => {
    const token = req.headers.authorization
    if (token) {
        jwt.verify(token, 'shhhhh', function (err, decoded) {
            if (decoded) {
                req.body.userID = decoded.userID;
                next();
            }
            else {
                res.status(404).json({ "msg": "please login" })
            }
            if (err) {
                res.status(404).json({ "msg": "please login" })
            }
        });
    }
    else {
        res.status(404).json({ "msg": "please login" })
    }
}
module.exports = { authe }
