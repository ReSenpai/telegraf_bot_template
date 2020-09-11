const alias = require('../utils/alias')
const images = require('../data/images')
const help = require('../data/help')

function helpMenu(query) {
    
    query.replyWithPhoto(images.okkoBotArt, {
        caption: `Привет ${alias.usernameName(query)} \n${help.help}`,
        reply_to_message_id: alias.getMessageId(query)
    })
}

module.exports = { helpMenu }

