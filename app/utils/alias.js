
function getName(query) {
    const firstName = !query.from.first_name ? 'Коллега' : query.from.first_name
    const lastName = !query.from.last_name ? '' : query.from.last_name
    return `${firstName} ${lastName}`
}

function getUsername(query) {
    return !query.from.username ? '' : `@${query.from.username}`
}

function getChatId(query) {
    return query.chat.id
}

function getMessageId(query) {
    return query.message.message_id
}

function getFirsname(query) {
    return !query.from.first_name ? 'Коллега' : query.from.first_name
}

function getUserId(query) {
    return query.from.id
}

function getMessageText(query) {
    return query.message.text
}

function callbackMsgId(query) {
    return query.update.callback_query.message.message_id
}

function callbackData(query) {
    return query.update.callback_query.data
}

function usernameName(query) {
    return !getUsername(query) ? getName(query) : getUsername(query)
}

module.exports = { getName, getUsername, getChatId, getFirsname, getMessageId, getUserId, getMessageText, callbackMsgId, callbackData, usernameName }