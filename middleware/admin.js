module.exports = function (req, res, next) {
    if (!req.user.isAdmin) {
        //  403 forbidden
        return res.status(403).send("Access denied, admin is required...");
    }
    next();
};
