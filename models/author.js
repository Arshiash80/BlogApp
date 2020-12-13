const mongoose = require('mongoose')
const { Schema } = mongoose

const AuthorSchema = new Schema({
    first_name: { type:String, required:true, maxlength:15 },
    family_name: { type:String, required:true, maxlength:15 },
    image: { type:String, default:null },
    username: { type:String, required:true, maxlength:15 },
    email: { type:String, required:true },
    password: { type:String, required:true, minlength:4 },
    created_date: { type:Date, default: Date.now } 
})

// Virtual for Authors full name.
AuthorSchema
    .virtual('name')
    .get(function() {
        return this.first_name + " " + this.family_name
    })

// Virtual for Authors url.
AuthorSchema
    .virtual('url')
    .get(function() {
        return "/blog/author/" + this._id
    })

module.exports = mongoose.model('Author', AuthorSchema)