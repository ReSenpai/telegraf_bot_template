const config = require('../config');
const fs = require('fs')

class Logger {
    constructor(logLvl, type) {
        this._logLvl = logLvl;
        this._type = type;
        this._start = 0;
        this._end = 0;
        this._color = {
            cyan: '\x1b[36m%s\x1b[0m',
            yellow: '\x1b[33m%s\x1b[0m',
            red: '\x1b[31m%s\x1b[0m',
            green: '\x1b[32m%s\x1b[0m',
            puprple: '\x1b[35m%s\x1b[0m',
            grey: '\x1b[37m%s\x1b[0m'
        }
    }
    /**
     * Date/Time log + line
     * @param {number} logLvl 
     */
    logLine(logLvl) {
        if (this._logLvl >= logLvl) {
            console.log(`------------------------------------------------------------------------------------`);
        }    
    }
    /**
     * Service method for marking
     * @param {string} moduleName Name console log
     * @param {any} message What we're loging
     * @returns {any} Formatted console log
     */
    _logStr(moduleName, message) {
        if (typeof message == 'object') {
            setTimeout(() => {
                console.log(message);
            }, 100)
            return `${this._getTime()}/ ${moduleName} :`
            
        }
        return `${this._getTime()}/ ${moduleName} : ${message}`
    }
    /**
     * Gives an actal time
     */
    _getTime() {
        const date = new Date();
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getUTCMinutes()).slice(-2);
        const seconds = ('0' + date.getUTCSeconds()).slice(-2);
        const days = ('0' + date.getDate()).slice(-2);
        const months = ('0' + (date.getMonth() + 1)).slice(-2);
        const years = date.getFullYear();
        return `${days}.${months}.${years} / ${hours}:${minutes}:${seconds} `;
    }
    /**
     * Console log white
     * @param {number} logLvl Loging level
     * @param {string} moduleName Name console log
     * @param {any} message What we're loging
     */
    log(logLvl, moduleName, message) {
        if (this._logLvl >= logLvl) {
            console.log(this._logStr(moduleName, message));
        }
    }
    /**
     * A service method for compiling colored logs
     * @param {string} color Color
     * @param {number} logLvl Loging level
     * @param {string} moduleName Name console log
     * @param {any} message What we're loging
     */
    _default(color, logLvl, moduleName, message) {
        if (this._type === 'txtlogs') {
            console.log(this._logStr(moduleName, message));
        } else {
            if (this._logLvl >= logLvl) {
                console.log(color, this._logStr(moduleName, message));
            }
        }  
    }
    /**
     * Console log cyan
     * @param {number} logLvl Loging level
     * @param {string} moduleName Name console log
     * @param {any} message What we're loging
     */
    debug(logLvl, moduleName, message) {
        this._default(this._color.cyan, logLvl, moduleName, message);
    }
    /**
     * Console log gold
     * @param {number} logLvl Loging level
     * @param {string} moduleName Name console log
     * @param {any} message What we're loging
     */
    prime(logLvl, moduleName, message) {
        this._default(this._color.yellow, logLvl, moduleName, message);
    }
    /**
     * Console log red
     * @param {number} logLvl Loging level
     * @param {string} moduleName Name console log
     * @param {any} message What we're loging
     */
    error(logLvl, moduleName, message) {
        this._default(this._color.red, logLvl, moduleName, message);
    }
    /**
     * Console log green
     * @param {number} logLvl Loging level
     * @param {string} moduleName Name console log
     * @param {any} message What we're loging
     */
    green(logLvl, moduleName, message) {
        this._default(this._color.green, logLvl, moduleName, message);
    }
    /**
     * Algorithm speed
     * @param {number} logLvl Loging level
     * @param {string} moduleName Name console log
     * @param {string} position Location of measurement: 'start' or 'end'
     */
    time(logLvl, moduleName, position) {
        if (this._logLvl >= logLvl) {
            if (position == 'start') {
                this._start = new Date().getTime();
            } else if (position == 'end') {
                this._end = new Date().getTime();
                console.log(` ${moduleName} : speed ${(this._end - this._start)} ms`);
            }
            
        }
    }
}

const logger = new Logger(config.logLvl, config.type);

module.exports = logger;

