const tb = require('./token-buttons')

module.exports = {
    superAdmin: [
        [tb.userToken],
        [tb.adminToken],
        [tb.closeToken]
    ],
    admin: [
        [tb.userToken],
        [tb.closeToken]
    ],
    author: [
        [tb.userToken],
        [tb.adminToken],
        [tb.superAdminToken],
        [tb.closeToken]
    ]
}