const mongoose = require('mongoose')
const Schema = mongoose.Schema 
/**
 * History token mongoDB schema
 */
const historyToken = new Schema({
    token: {
        type: String,
        required: true
    },
    add_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    add_user_id: {
        type: Number,
        required: true
    },
    add_name: {
        type: String
    },
    add_username: {
        type: String
    },
    delete_date: {
        type: Date,
    },
    use_date: {
        type: Date
    },
    use_user_id: {
        type: Number
    },
    use_name: {
        type: String
    },
    use_username: {
        type: String
    }
})

mongoose.model('historytoken', historyToken)
