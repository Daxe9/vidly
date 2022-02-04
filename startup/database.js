const winston = require("winston");
const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
});
const config = require("config");

const mongoose = require("mongoose");
module.exports = function () {
    const db = config.get("db");
    mongoose
        .connect(db, {
            useUnifiedTopology: true,
        })
        .then(() => logger.info(`Connected to ${db} database.`));
};
