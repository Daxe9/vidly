const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const _ = require("lodash");
const auth = require("../middleware/authentication-middleware");
const { User, validateRequest } = require("../models/user-model");
// router.get("/", async (req, res) => {
//     const users = await User.find().sort({ name: 1 });
//     res.send(users);
// });
router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.send(user);
    } catch (e) {
        res.send("No user was found with given Id");
    }
});

router.post("/", async (req, res) => {
    // validating request
    const { error } = validateRequest(req);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let isValidUsername = await User.findOne({ username: req.body.username });
    let isValidEmail = await User.findOne({ email: req.body.email });
    if (isValidEmail || isValidUsername) {
        return res.status(400).send("Email or username already registered...");
    }

    try {
        let user = new User(
            _.pick(req.body, ["username", "email", "password"])
        );
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user.save();
        // get token
        const token = user.generateAuthToken();
        res.header("x-auth-token", token).send(
            _.pick(user, ["_id", "username", "email"])
        );
        console.log("User saved in Database...");
    } catch (err) {
        res.status(400).send("Impossible to save user in database...");
        console.log("Impossible to save user in database...");
    }
});

module.exports = router;
