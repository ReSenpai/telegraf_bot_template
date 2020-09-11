/**
 * Authorization module
 */
const tk = require('../keyboard/token-keyboard')
const tb = require('../keyboard/token-buttons')
const tokenText = require('../data/token-text')
const logg = require('../utils/debug')
const img = require('../data/images')
const alias = require('../utils/alias')
const animation = require('../data/animation')
const ak = require('../keyboard/authorization_keyboard')
const queryes = require('../mongodb/queryes')
const mongoose = require('mongoose')
require('../mongodb/token_store')
require('../mongodb/history_token')
const tokenStore = mongoose.model('tokenstore')
const historyToken = mongoose.model('historytoken')
/**
 * Function generate tokens
 * @param {String} type token rank
 * @returns {String} Ready token
 */
function generateToken(type) {

    let length = 16
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let retVal = ""

    if (type == 'admin' || type == 'super_admin') {
        length = 32
    }

    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }

    if (type == 'admin') {
        return `${retVal}:admin`
    } else if (type == 'super_admin') {
        return `${retVal}:super_admin`
    } else {
        return `${retVal}:user`
    }
}
/**
 * Displays token generation menu
 * @param {Object} query Telegraf Object (ctx \ query)
 * @param {String} rank Rank the person who calls the menu 
 * @returns {Object} Returns different menus depending on rank
 */
function tokenMenu(query, rank) {

    let keyboard

    if (rank === 'super_admin') {
        keyboard = tk.superAdmin
    } else if (rank === 'author') {
        keyboard = tk.author
    } else {
        keyboard = tk.admin
    }
    
    return query.telegram.sendPhoto(query.from.id, img.cyberpunkTerminal, {
        reply_markup: {
            inline_keyboard: keyboard
        },
        caption: tokenText.description
    })
}

function tokenCallbackQuery(query) {
    const messageId = query.update.callback_query.message.message_id

    function tokenTimer(saerchToken) {
        setTimeout(async () => {
            const deleteToken = await tokenStore.findOne({token: saerchToken})
            const history = await historyToken.findOne({token: saerchToken})
            if (!deleteToken) {
                return true
            } else {
                await tokenStore.deleteOne(deleteToken)
                .then(() => logg.debug(2, 'MongoDB remove the token on the timer', saerchToken))
                history.status = 'Deleted'
                history.delete_date = new Date
                await history.updateOne(history)
            }
        }, 604800000)
    }

    function generateTokenMsg(rank) {
        setTimeout(() => {
            if (rank === 'user') query.reply('Токен удалится через 7 дней')
            if (rank === 'admin') query.reply('Токен дает права Администратора\nАдминистратор может создавать токены для обычных юзеров\nТокен удалится через 7 дней')
            if (rank === 'super_admin') query.reply('Безлимитные токен с максимальными правами')
        }, 1500)   
    }

    async function addToken(rank) {
        const token = generateToken(rank)
        const checkToken = await tokenStore.findOne({token: token})

        if (checkToken) {
            addToken(rank)
            logg.prime(2, 'Won the lottery, the token is already in the database', token)
        } else {

            query.replyWithMarkdown(`\`${token}\``)
            generateTokenMsg(rank)
            query.answerCbQuery('Токен создан')
            query.deleteMessage(alias.callbackMsgId(query))

            await new tokenStore({
                token: token,
                rank: rank
            })
            .save()
            .then(() => logg.debug(2, 'Add new token', token))

            await new historyToken({
                token: token,
                add_date: new Date,
                status: 'Waiting',
                add_user_id: alias.getUserId(query),
                add_name: alias.getName(query),
                add_username: alias.getUsername(query)
            })
            .save()
            .then(() => logg.debug(2, 'Add new history token', token))
            
            if (rank != 'super_admin') tokenTimer(token)
        }
    }

    switch(alias.callbackData(query)) {
        case tb.userToken.callback_data:
            addToken('user')
            break
        case tb.adminToken.callback_data:
            addToken('admin')
            break
        case tb.superAdminToken.callback_data:
            addToken('super_admin')
            break
        case tb.closeToken.callback_data:
            query.answerCbQuery('Закрываем...')
            query.deleteMessage(messageId)
            break
    }
}


function authorizationMenu(query) {
    query.telegram.sendAnimation(alias.getUserId(query), animation.uShallNotPass, {
        caption: 'Введите токен для авторизации. \n\nТокен можно запросить у СС или администратора. \n\nПо всем вопросам можно писать @Re_Senpai',
        reply_markup: {
            inline_keyboard: ak.authorizationMenu
        }
    })
}

function authorizationCallbackQuery(query) {
    switch (query.update.callback_query.data) {
        case 'authorization':
            query.telegram.sendMessage(query.from.id, 'Введите токен', {
                reply_markup: {
                    force_reply: true
                }
            })
            query.deleteMessage(query.update.callback_query.message.message_id)
            return true
        case 'close_authorization':
            query.deleteMessage(query.update.callback_query.message.message_id)
            return true
    }
    return false
}

function authorizationCallbackQueryPost(query) {
    switch (query.update.callback_query.data) {
        case 'authorization':
            query.answerCbQuery('Вы уже авторизовались 😉')
            return true
        case 'close_authorization':
            query.deleteMessage(query.update.callback_query.message.message_id)
            return true
    }
    return false
}

async function checkToken(query) {
    
    if(/:user$|:admin$|:super_admin$/.test(alias.getMessageText(query))) {
        query.reply('Проверяю...')
        const checkToken = alias.getMessageText(query)
        const token = await tokenStore.find({token: checkToken})
        if (!token) {
            setTimeout(() => {
                query.reply('Токен устарел или был использован.\n\nСрок жизни свежего токена - 30 минут.')
            }, 1500)
        } else {
            const rank = token[0].rank
            queryes.addUser(query, token[0].rank, token[0].token)
            await tokenStore.deleteOne(token[0])
            .then(() => logg.debug(2, 'MongoDB token used', alias.getMessageText(query)))

            setTimeout(() => {  
                if (rank === 'user') {
                    query.reply(`Токен принят.\n\nДобро пожаловать в команду ${alias.usernameName(query)} 🥰🥰🥰\n\n/start - Главное меню\n\n/sticker - Квест стикеры\n\n/help - О боте и его функциях\n\nВсе команды можно всегда посмотреть справа снизу, иконка /`)
                } else {
                    query.reply(`Токен принят.\n\nДобро пожаловать в команду ${alias.usernameName(query)} 🥰🥰🥰\n\n/start - Главное меню\n\n/sticker - Квест стикеры\n\n/keygen - Меню генерации токенов\n\n/help - О боте и его функциях\n\nВсе команды можно всегда посмотреть справа снизу, иконка /`)
                }   
            }, 1500)

            const history = await historyToken.findOne({token: token[0].token})
            history.status = 'Actived'
            history.use_date = new Date
            history.use_user_id = alias.getUserId(query)
            history.use_name = alias.getName(query)
            history.use_username = alias.getUsername(query)
            await history.updateOne(history)
            .then(() => logg.debug(2, 'MongoDB history use token', token[0].token))    
        }
    }
}

module.exports = { tokenMenu, tokenCallbackQuery, authorizationMenu, authorizationCallbackQuery, checkToken, authorizationCallbackQueryPost }