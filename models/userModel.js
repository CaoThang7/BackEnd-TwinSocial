const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        default: 'user',
    },
    gender: {
        type: String,
        default: 'male',
    },
    birthday: {
        type: String,
        default: Date.now(),
    },
    mobile: {
        type: String,
        default: '',
    },
    address: {
        type: String,
        default: '',
    },
    story: {
        type: String,
        default: '',
        maxlength: 200
    },
    followers: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    following: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    saved: [{ type: mongoose.Types.ObjectId, ref: 'user' }]

}, {
    timestamps: true
})


module.exports = mongoose.model('user', userSchema)