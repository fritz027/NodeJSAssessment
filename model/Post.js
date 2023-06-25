const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: [true, 'Title is required!'],
        trim: true
    },
    content:  {
        type: String,
        required: [true, 'Content is required!'],
        minLenght: [20, 'Content must be greater than 20 characters'],
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true, 
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

})

PostSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
    justOne: false
})

PostSchema.virtual('likes', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
    justOne: false
})

module.exports = mongoose.model('Post', PostSchema)