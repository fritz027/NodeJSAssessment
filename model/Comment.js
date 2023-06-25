
const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    comment:  {
        type: String,
        required: [true, 'First name is required!'],
        maxLength: [150, 'First name must not be greater than 150 characters'],
        trim: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Comment', CommentSchema)