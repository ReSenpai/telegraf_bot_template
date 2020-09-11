
const kb = require('./keyboard-buttons');

module.exports = {
    menu: [
        [kb.menu.generalCC],
        [kb.menu.administrative],
        [kb.menu.usefulInf],
        [kb.menu.closed]
    ],
    generalCC: [
        [kb.generalCC.structure],
        [kb.generalCC.carer],
        [kb.back]
    ],
    administrative: [
        [kb.administrative.holiday, kb.administrative.hospital],
        [kb.administrative.replace, kb.administrative.schedule],
        [kb.administrative.countingSal, kb.back]
    ],
    usefulInf: [
        [kb.usefulInf.links, kb.usefulInf.settingVPN],
        [kb.usefulInf.outlukFolder],
        [kb.usefulInf.signOutlook],
        [kb.back]
    ]
}