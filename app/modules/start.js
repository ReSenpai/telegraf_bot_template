const kt = require('../data/keyboard-text')
const keyboard = require('../keyboard/keyboard')
const alias = require('../utils/alias')
const logg = require('../utils/debug')
const mongoose = require('mongoose')
require('../mongodb/usersSchema')
const users = mongoose.model('users')

async function startMenu(query) {

    const random = Math.abs(Math.ceil((Math.random() * kt.daily.length) - 1));

    function sendMenu() {
        return query.reply(kt.daily[random], {
            reply_to_message_id : alias.getMessageId(query),
            reply_markup: {
                inline_keyboard: keyboard.menu
            },
            parse_mode: 'markdown'
        })
    }

    try {
        id = await users.findOne({user_id: alias.getUserId(query)})
        let messageObj = id.message_id

        function updateMsgId() {
            return sendMenu().then(obj => {
                messageObj[alias.getChatId(query)] = obj.message_id
                id.updateOne({message_id: messageObj}).then(() => logg.debug(2, 'MongoDB update message_id', obj.message_id))
            })
        }
    
        if(!messageObj[alias.getChatId(query)]) {
            updateMsgId()
        } else {
            query.deleteMessage(messageObj[alias.getChatId(query)])
            updateMsgId()
        }   
    } catch (error) {
        logg.error(2, 'MongoDB update message_id', error)
    }
}

module.exports = { startMenu }