const mongoose = require('mongoose');
const express = require('express');
const rateLimit = require('express-rate-limit')
const BlogRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { UserModel } = require('../Model/user.model');
const { authe } = require('../Middleware/Authenticate.mw');
const { ArticleModel } = require('../Model/articles.model');
const { logger } = require('../Middleware/tracker.mw');
const { limiterRate } = require('../Middleware/ratelimi.mw');
BlogRouter.use(limiterRate)
/**
 * @swagger
 *  post:
 *  description:register user
 */
BlogRouter.post("/register", async (req, res) => {
    const { email } = req.body;
    let registerd = await UserModel.find({ email: email });
    if (registerd.length) {
        res.status(404).json({ "msg": "user already exists!!" })
    }
    else {
        bcrypt.hash(req.body.password, 2, async function (err, hash) {
            await UserModel.insertMany({ ...req.body, password: hash })
        });
        res.json({ "msg": "User registered Succesfully" })
    }
})
BlogRouter.post("/login", async (req, res) => {
    let user = await UserModel.find({ email: req.body.email })
    if (!(user.length)) {
        res.status(404).json({ "msg": "wrong email/password" })
    }
    else {
        const { password, _id } = user[0];
        bcrypt.compare(req.body.password, password, function (err, result) {
            if (result) {
                var token = jwt.sign({ userID: _id }, 'shhhhh');
                res.json({ msg: "Logged In", "token": token })
            }
            else {
                res.status(404).json({ "msg": "wrong password" })
            }
            if (err) {
                res.status(404).json({ "msg": "error", err: err })
            }
        });
    }

})

BlogRouter.get("/articles", authe, logger, async (req, res) => {
    const token = req.headers.authorization
    var decoded = jwt.verify(token, 'shhhhh');
    const { title, category, page, limit } = req.query;
    let skip = ((page - 1) * limit)
    if (page == undefined || limit == undefined) {
        skip = 0;
    }
    if (title && category) {
        res.send(await ArticleModel.find({ $and: [{ title: title }, { category: category }, { userID: decoded.userID }] }).skip(skip).limit(limit))
    }
    else if (title) {
        res.send(await ArticleModel.find({ $and: [{ title: title }, { userID: decoded.userID }] }).skip(skip).limit(limit))
    }
    else if (category) {
        res.send(await ArticleModel.find({ $and: [{ category: category }, { userID: decoded.userID }] }).skip(skip).limit(limit))
    }
    else {
        res.send(await ArticleModel.find({ userID: decoded.userID }).skip(skip).limit(limit))
    }
})
BlogRouter.post("/articles/add", authe, async (req, res) => {
    await ArticleModel.insertMany(req.body)
    res.json({ "msg": "Article Added" })
})
BlogRouter.get("/articles/:id", authe, async (req, res) => {
    res.send(await ArticleModel.find({ _id: req.params.id }))
})
BlogRouter.put("/articles/edit/:id", authe, async (req, res) => {
    await ArticleModel.findByIdAndUpdate({ _id: req.params.id }, req.body)
    res.json({ msg: "Articles has been Updated" })
})
BlogRouter.delete("/articles/rem/:id", authe, async (req, res) => {
    await ArticleModel.findByIdAndDelete({ _id: req.params.id })
    res.json({ msg: "Articles has been Deleted" })
})

module.exports = { BlogRouter }