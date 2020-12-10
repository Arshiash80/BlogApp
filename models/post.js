const mongoose = require('mongoose')
const { Schema } = mongoose

const PostSchema = new  Schema({
    author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
    title: { type:String, required:true, maxlength:100 },
    content: { type:String, required: true, minlength: 100 },
    likes: { type:Number, default: 0 },
    status: { type:String, required: true, enum: ["Private", "Public"], default: 'Private' },
    created_date: { type:Date, default: Date.now }
})

PostSchema
    .virtual('url')
    .get(function() {
        return '/blog/post/' + this._id
    })

module.exports = mongoose.model('Post', PostSchema)