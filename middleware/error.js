const { logger } = require('../startup/logging');
module.exports = function (err, req, res, next) {
    // status 500 internal server error
    logger.error( err.message );
    res.status(500).send("Something has failed.");
}