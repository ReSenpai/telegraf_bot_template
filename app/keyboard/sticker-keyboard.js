const sb = require('./sticker-buttons')

module.exports = {
    startMenu: [
        [sb.startMenu.random],
        [sb.startMenu.pieDog],
        [sb.startMenu.goblach],
        [sb.startMenu.FAQ],
        [sb.close]
    ],
    pieDog: [
        [sb.pieDogMenu.kickOrPat],
        [sb.back]
    ],
    goblach: [
        [sb.goblach.goblachDebil],
        [sb.back]
    ],
    FAQ: [
        [sb.back]
    ],
    kickOrPat: [
        [sb.kickOrPat.pat, sb.kickOrPat.kick]
    ],
    goblachDebil: [
        [sb.goblachDebil.yes, sb.goblachDebil.no]
    ],
    goblachProof: [
        [sb.goblachDebil.yesYes, sb.goblachDebil.noNo]
    ],
    back: [
        [sb.back]
    ]
}