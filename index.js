require("dotenv").config();
const express = require("express");
// const winston = require('winston/lib/winston/config');
const app = express();
const winston = require("winston");
const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
});
// load routes
require("./startup/routes")(app);
// load database
require("./startup/database")();
// load logging errors
const { fun } = require("./startup/logging");
fun();
// load configuration
require("./startup/config")();
// load joi object id
require("./startup/validation")();

// listen to a specific port --> 5000
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    logger.info(`Listening on port ${port}...`);
});

module.exports = server;
