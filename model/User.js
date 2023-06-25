const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    firstName:  {
        type: String,
        required: [true, 'First name is required!'],
        maxLength: [30, 'First name must not be greater than 30 characters'],
        trim: true,
    },
    lastName:  {
        type: String,
        required: [true, 'Last name is required!'],
        maxLength: [50, 'First name must not be greater than 50 characters'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            'Please enter a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please enter a password!'],
        minLength: 6,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

//Hash Password after Save using bcrypt
UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

module.exports = mongoose.model('User', UserSchema)