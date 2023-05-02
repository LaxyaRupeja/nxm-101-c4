const mongoose = require('mongoose');
const articlesSchema = mongoose.Schema({
    title: String,
    body: String,
    user: String,
    category: String,
    live: Boolean,
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
}, {
    versionKey: false
})
const ArticleModel = mongoose.model("blogArt", articlesSchema)
module.exports = { ArticleModel }