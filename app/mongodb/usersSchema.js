const mongoose = require('mongoose')
const Schema = mongoose.Schema  

const UsersSchema = new Schema({
    user_id: {
        type: Number,
        required: true
    },
    rank: {
        type: String,
        required: true
    },
    message_id: {
        type: Object,
    },
    sticker_id: {
        type: Object
    },
    username: {
        type: String
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    addDate: {
        type: Date
    },
    token: {
        type: String,
        required: true,
        default: 0
    }
})

mongoose.model('users', UsersSchema)