const mongoose = require('mongoose')
const Schema = mongoose.Schema  

const tokenStore = new Schema({
    token: {
        type: String
    },
    rank: {
        type: String
    }
})

mongoose.model('tokenstore', tokenStore)