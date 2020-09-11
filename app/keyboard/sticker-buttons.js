
module.exports = {
    startMenu: {
        random: {
            text: 'Рандом 🎲',
            callback_data: 'randomSticker'
        },
        pieDog: {
            text: 'Пирожок',
            callback_data: 'pieDog'
        },
        goblach: {
            text: 'Гоблач',
            callback_data: 'goblach'
        },
        FAQ: {
            text: 'Что это? ❔',
            callback_data: 'FAQsticker'
        }
    },
    pieDogMenu: {
        kickOrPat: {
            text: 'Пнуть/Гладить',
            callback_data: 'kickOrPat'
        }
    },
    goblach: {
        goblachDebil: {
            text: 'Дебил',
            callback_data: 'goblachDebil'
        }
    },
    kickOrPat: {
        kick: {
            text: 'Пнуть',
            callback_data: 'kick'
        },
        pat: {
            text: 'Погладить бота',
            callback_data: 'pat_bot'
        }
    },
    goblachDebil: {
        yes: {
            text: 'Это я',
            callback_data: 'goblach_yes'
        },
        no: {
            text: 'Нет',
            callback_data: 'goblach_no'
        },
        yesYes: {
            text: 'Могу',
            callback_data: 'goblach_proof'
        },
        noNo: {
            text: 'Неа',
            callback_data: 'goblach_not_proof'
        }
    },
    back: {
        text: 'Назад',
        callback_data: 'backSticker'
    },
    close: {
        text: 'Закрыть',
        callback_data: 'closeSticker'
    }
}