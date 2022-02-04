const config = require("config");
module.exports = function () {
    if (!config.get("jwtPrivateKey")) {
        // key is not defined
        throw new Error("FATAL ERROR, 'jwtPrivateKey' not defined...");
        // 1 if exit by error
        process.exit(1);
    }
};
