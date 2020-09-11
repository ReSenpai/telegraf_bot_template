/**
 * Re Senpai 2020
 */
const { Telegraf } = require('telegraf')
const mongoose = require('mongoose')
const config = require('./config')
const logg = require('./utils/debug')
const queryes = require('./mongodb/queryes')
const alias = require('./utils/alias')
const modules = {
    menu : require('./modules/menu').menu,
    stickerQuestCallback: require('./modules/sticker-quest').stickerQuestCallback,
    stickerMenu: require('./modules/sticker-quest').stickerMenu,
    tokenMenu: require('./modules/authorization').tokenMenu,
    tokenCallbackQuery: require('./modules/authorization').tokenCallbackQuery,
    authorizationMenu: require('./modules/authorization').authorizationMenu,
    authorizationCallbackQuery: require('./modules/authorization').authorizationCallbackQuery,
    authorizationCallbackQueryPost: require('./modules/authorization').authorizationCallbackQueryPost,
    checkToken: require('./modules/authorization').checkToken,
    startMenu: require('./modules/start').startMenu,
    helpMenu: require('./modules/help').helpMenu
}  
const bot = new Telegraf(config.TOKEN)

logg.logLine(1)

mongoose.connect(config.DB_URL, {
    useNewUrlParser: true, useUnifiedTopology: true
})
.then(() => logg.green(1, 'MongoDB', 'Connected'))
.then(() => logg.green(1, 'Telegraf okko bot inline', 'Launched'))
.catch(error => logg.error(2, 'MongoDB Connected', error))

bot.start(async ctx => {

    logg.log(2, 'START', `${alias.getName(ctx)} сlicked /start`)
    const user = await queryes.getUser(ctx)

    if (!user) {
        modules.authorizationMenu(ctx)
    } else {
        modules.startMenu(ctx)
    }
})

bot.command('sticker', async (ctx) => {
    logg.log(2, 'STICKER', `${alias.getName(ctx)} сlicked /sticker`)
    const user = await queryes.getUser(ctx)
    if (!user) {
        modules.authorizationMenu(ctx)
    } else {
        modules.stickerMenu(ctx)
    } 
})

bot.command('keygen', async (ctx) => {
    logg.log(2, 'KEYGEN', `${alias.getName(ctx)} сlicked /keygen`)
    const user = await queryes.getUser(ctx)
    if (!user) {
        ctx.telegram.sendMessage(ctx.from.id, 'Обмануть меня вздумал? 🤨')
    } else if(user.rank === 'super_admin') {
        modules.tokenMenu(ctx, 'super_admin')
    } else if (user.rank === 'admin') {
        modules.tokenMenu(ctx, 'admin')
    } else if (user.rank === 'author') {
        modules.tokenMenu(ctx, 'author')
    } else {
        ctx.reply('У вас не хватает доступа для этой функции 🤨')
    }  
})

bot.help(async ctx => {
    logg.log(2, 'HELP', `${alias.getName(ctx)} сlicked /help`)
    modules.helpMenu(ctx)

})


bot.on('message', async (ctx) => {
    logg.log(2, `${alias.getName(ctx)} ${alias.getUsername(ctx)} sent`, alias.getMessageText(ctx))
    logg.log(4, 'CTX', ctx)
    // ctx.telegram.sendMessage(532419537, `/start ${ctx.from.first_name} ${ctx.from.last_name}`)

    const user = await queryes.getUser(ctx)
    
    if (!user) {
        modules.checkToken(ctx)
    } else {
        if(/:user$|:admin$|:super_admin$/.test(alias.getMessageText(ctx))) {
            ctx.reply('Вы уже авторизованы в системе 😅\n\nПросто напишите /start')
        }
    } 
})

bot.on('callback_query', async (query) => {
    logg.log(2, 'callback_query', `${query.from.first_name} ${query.from.last_name} poked at ${query.update.callback_query.data}`)
    // query.telegram.sendMessage(532419537, `${query.from.first_name} ${query.from.last_name} poked at ${query.update.callback_query.data}`)
    logg.log(4, 'query obj', query.update.callback_query.message)

    const user = await queryes.getUser(query)
    
    if (!user) {
        if (modules.authorizationCallbackQuery(query)) {
            
        } else {
            query.answerCbQuery('Сначала авторизуйтесь, напишите /start')
        }   
    } else {
        try {
            modules.menu(query, user)
            modules.stickerQuestCallback(query, user)
            modules.tokenCallbackQuery(query)
            modules.authorizationCallbackQueryPost(query)
        } catch (error) {
            logg.log(2, 'switch keyboard', error)
        }  
    } 
})

bot.launch()