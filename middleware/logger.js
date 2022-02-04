function log(req, res, next) {
    let time = new Date();
    let currentTiime = "["+time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + "]"
    console.log(`${currentTiime} Logging...`);
    next();
}

module.exports = log;