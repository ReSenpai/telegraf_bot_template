const kb = require('../keyboard/keyboard-buttons')
const kt = require('../data/keyboard-text')
const keyboard = require('../keyboard/keyboard')
const queryes = require('../mongodb/queryes')

function menu(query, user) {

    const chatId = query.update.callback_query.message.chat.id
    const messageId = query.update.callback_query.message.message_id
    const username = query.from.username
    let replyId
    try {
        replyId = query.update.callback_query.message.reply_to_message.from.id
    } catch (error) {
        replyId = false
    }

    function editMessage(text, keyboard) {
        if (replyId == user.user_id) {
            return query.editMessageText(text, {
                reply_markup: {
                    inline_keyboard: keyboard
                },
                parse_mode: 'markdown'
            }, { chat_id: chatId, message_id: messageId })
            .catch(() => query.answerCbQuery('Вы уже в этом меню сейчас 🙄'))
        } else {
            query.answerCbQuery(`${!username ? query.from.first_name : '@' + username} 😉Тыкайте на свою плашку или напишите /start`)
        }
    }

    function closeMessage() {
        if (replyId == user.user_id) {
            query.deleteMessage(messageId)
            .then(() => query.answerCbQuery('Закрываем...'))
            .catch(() => query.answerCbQuery('Сообщение не удалить, прошло слишком много времени 😔'))
            if (messageId == user.message_id[chatId]) {
                queryes.deleteMessageId(query, chatId)
            }  
        } else {
            query.answerCbQuery(`${!username ? query.from.first_name : '@' + username} 😉Тыкайте на свою плашку или напишите /start`)
        }
    }

   switch (query.update.callback_query.data) {
        case kb.menu.generalCC.callback_data:
            editMessage(kt.generalCC.structure, keyboard.generalCC)
            break
        case kb.menu.administrative.callback_data:
            editMessage(kt.administrative.schedule, keyboard.administrative)
            break
        case kb.menu.usefulInf.callback_data:
            editMessage(kt.usefulInf.links, keyboard.usefulInf)
            break
        case kb.menu.closed.callback_data:
            closeMessage()   
            break
        case kb.back.callback_data:
            const random = Math.abs(Math.ceil((Math.random() * kt.daily.length) - 1));
            editMessage(kt.daily[random], keyboard.menu)
            break
        case kb.generalCC.unit.callback_data:
            editMessage(kt.generalCC.unit, keyboard.generalCC)
            break
        case kb.generalCC.structure.callback_data:
            editMessage(kt.generalCC.structure, keyboard.generalCC)
            break
        case kb.generalCC.carer.callback_data:
            editMessage(kt.generalCC.carer, keyboard.generalCC)
            break
        case kb.administrative.holiday.callback_data:
            editMessage(kt.administrative.holiday, keyboard.administrative)
            break
        case kb.administrative.hospital.callback_data:
            editMessage(kt.administrative.hospital, keyboard.administrative)
            break
        case kb.administrative.replace.callback_data:
            editMessage(kt.administrative.replace, keyboard.administrative)
            break
        case kb.administrative.countingSal.callback_data:
            editMessage(kt.administrative.countingSal, keyboard.administrative)
            break
        case kb.administrative.schedule.callback_data:
            editMessage(kt.administrative.schedule, keyboard.administrative)
            break
        case kb.usefulInf.links.callback_data:
            editMessage(kt.usefulInf.links, keyboard.usefulInf)
            break
        case kb.usefulInf.outlukFolder.callback_data:
            editMessage(kt.usefulInf.outlukFolder, keyboard.usefulInf)
            break
        case kb.usefulInf.signOutlook.callback_data:
            editMessage(kt.usefulInf.signOutlook, keyboard.usefulInf)
            break
        case kb.usefulInf.settingVPN.callback_data:
            editMessage(kt.usefulInf.settingVPN, keyboard.usefulInf)
            break
    } 
}

module.exports = { menu }