const sk = require('../keyboard/sticker-keyboard')
const sb = require('../keyboard/sticker-buttons')
const stickers = require('../data/stickers')
const alias = require('../utils/alias')

function stickerMenu(query) {

    function sendSticker(sticker, keyboard) {
        return query.replyWithSticker(sticker, {
            disable_notification: true,
            reply_markup: {
                inline_keyboard: keyboard
            }
        })
    }

    sendSticker(stickers.behindTheDorr, sk.startMenu)
}

function stickerQuestCallback(query, user) {
    const messageId = query.update.callback_query.message.message_id

    function sendSticker(sticker, keyboard) {
        return query.replyWithSticker(sticker, {
            disable_notification: true,
            reply_markup: {
                inline_keyboard: keyboard
            }
        })     
    }

    function timer(message, time) {
        return setTimeout(() => {
            query.reply(message)
        }, time)
    }

    function sendText(text, keyboard) {
        return query.reply(text, {
            reply_markup: {
                inline_keyboard: keyboard
            }
        })
    }

    switch (query.update.callback_query.data) {
        /**
         * Sticker main menu
         */
        case sb.startMenu.random.callback_data:
            query.answerCbQuery('Рандом скоро подвезут')
            break;
        case sb.startMenu.pieDog.callback_data:
            query.deleteMessage(messageId)
            sendSticker(stickers.cofe, sk.pieDog)
            break
        case sb.startMenu.goblach.callback_data:
            query.deleteMessage(messageId)
            sendSticker(stickers.goblachWTF, sk.goblach)
            break
        case sb.startMenu.FAQ.callback_data:
            query.deleteMessage(messageId)
            sendText(stickers.FAQ, sk.FAQ)
            break
        case sb.close.callback_data:
            query.deleteMessage(messageId)
            break
        /**
         * Goblach menu
         */
        case sb.goblach.goblachDebil.callback_data:
            query.deleteMessage(messageId)
            sendSticker(stickers.goblachDebil, sk.goblachDebil)
            break
        /**
         * Pie menu
         */
        case sb.pieDogMenu.kickOrPat.callback_data:
            query.deleteMessage(messageId)
            sendSticker(stickers.sadness, sk.kickOrPat)
            break

        case sb.back.callback_data:
            query.deleteMessage(messageId)
            sendSticker(stickers.behindTheDorr, sk.startMenu)
            break
        case 'pat_bot':
            query.deleteMessage(messageId) 
            sendSticker(stickers.jojoPose, sk.back)
            timer(`${alias.usernameName(query)} -10 XP за сочувствие`, 500)
            timer('А вот ненадо было меня гладить...', 1500)
            break
        case 'kick':
            query.deleteMessage(messageId)           
            sendSticker(stickers.dontKickMe, sk.back, `За чтооо...\n\n${alias.usernameName(query)} +50 XP за мужество`)
            timer('За чтооо...', 500)
            timer(`${alias.usernameName(query)} +50 XP за мужество`, 1200)
            break
        case 'goblach_yes':
            query.deleteMessage(messageId)
            sendSticker(stickers.goblachProof, sk.goblachProof)
            break
        case 'goblach_no':
            query.deleteMessage(messageId)
            sendSticker(stickers.goblachAndWhat, sk.back)
            timer(`${alias.usernameName(query)} был опознан, - 50 монет...`, 1000)
            break
        case sb.goblachDebil.yesYes.callback_data:
            query.deleteMessage(messageId)
            timer('Проверяю...', 300)
            setTimeout(() => sendSticker(stickers.goblachWow, sk.back), 5000)
            timer(`${alias.usernameName(query)} получает 100 монет на лечение...`, 6000)
            break
        case sb.goblachDebil.noNo.callback_data:
            query.deleteMessage(messageId)
            sendSticker(stickers.goblachMaloletniyDebil, sk.back)
            timer(`${alias.usernameName(query)} был опознан, - 50 монет...`, 1000)
            break
    }
}

module.exports = { stickerQuestCallback, stickerMenu }