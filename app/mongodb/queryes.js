const logg = require('../utils/debug')
const mongoose = require('mongoose')
require('./usersSchema')
const users = mongoose.model('users')

async function addUser(obj, rank, token) {
    try {
        id = await users.findOne({user_id: obj.from.id})
        if(!id) {
            logg.debug(2, 'MongoDB add user', `${obj.from.first_name} ${obj.from.last_name}`)
            await new users({
                user_id: obj.from.id,
                rank: rank,
                message_id: {Object},
                sticker_id: {Object},
                first_name: !obj.from.first_name ? 'Коллега' : obj.from.first_name,
                last_name: !obj.from.last_name ? '' : obj.from.last_name,
                username: !obj.from.username ? 'none' : `@${obj.from.username}`,
                addDate: new Date(),
                token: token
            })
            .save()
        }
        return true
    } catch (error) {
        logg.error(2, 'MongoDB add user', error)
        return false
    }  
}

async function update(obj, sendMenu) {

    try {
        id = await users.findOne({user_id: obj.from.id})
        const chatId = obj.chat.id
        let messageObj = id.message_id
    
        if(!messageObj[chatId]) {
            sendMenu().then(obj => {
                messageObj[chatId] = obj.message_id
                id.updateOne({message_id: messageObj}).then(() => logg.debug(2, 'MongoDB update message_id', obj.message_id))
            }).catch(error => logg.error(2, 'MongoDB update message_id', error))
        } else {
            obj.deleteMessage(messageObj[chatId])
            sendMenu().then(obj => {
                messageObj[chatId] = obj.message_id
                id.updateOne({message_id: messageObj}).then(() => logg.debug(2, 'MongoDB update message_id', obj.message_id))
            }).catch(error => logg.error(2, 'MongoDB update message_id', error))
        } 
        return true   
    } catch (error) {
        logg.error(2, 'MongoDB update message_id', error)
        return false
    }
}

function deleteMessageId(obj, chatId) {
    users.findOne({user_id: obj.from.id}).then(id => {
        const msgId = id.message_id[chatId]
        const messageObj = id.message_id
        delete messageObj[chatId]
        id.updateOne({message_id: messageObj}).then(() => logg.debug(2, 'MongoDB delete message_id', msgId))
    }).catch(error => logg.error(2, 'MongoDB add user', error))
}

function getUser(obj) {
    return users.findOne({user_id: obj.from.id}).then(user => user)
}

module.exports = { addUser, deleteMessageId, getUser, update }