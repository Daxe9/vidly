const winston = require("winston");
require("winston-mongodb");
const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            filename: "log/error.log",
        }),
        new winston.transports.Console(),
        new winston.transports.MongoDB({
            db: "mongodb://127.0.0.1:27017/vidly",
            options: { useUnifiedTopology: true },
        }),
    ],
});
module.exports.logger = logger;
module.exports.fun = function () {
    // Catch all error information that is not been handled
    // it works only with sync codes
    process.on("uncaughtException", (error) => {
        // console.log("Uncaught exception.");
        logger.error(error.message);
        process.exit(1);
    });

    // Catch all error information asynchronous
    process.on("unhandledRejection", (error) => {
        // console.log("Promise rejected.");
        logger.error(error.message);
        // need to exit because the program is in a unclean state
        process.exit(1);
    });
};
