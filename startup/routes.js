const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const loggerTime = require("../middleware/logger");
const error = require("../middleware/error");
let logStream = fs.createWriteStream(path.join("./log/", "access.log"), {
    flags: "a",
});

module.exports = function (app) {
    // middleware use json file to request
    app.use(express.json());
    // use customized middleware ./middleware/logger.js
    app.use(loggerTime);
    // get information from user and then write it into access.log
    app.use(morgan("combined", { stream: logStream }));
    // router /api/genres
    app.use("/api/genres", genres);
    // router /api/customers
    app.use("/api/customers", customers);
    // router /api/movies
    app.use("/api/movies", movies);
    // router /api/rentals
    app.use("/api/rentals", rentals);
    // router /api/users
    app.use("/api/users", users);
    // router /aopi/auth
    app.use("/api/auth", auth);

    app.use(error);
};
