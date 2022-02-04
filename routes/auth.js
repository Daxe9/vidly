/*
Autentication of user, aka, log in 

log out is done from client
*/

const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const router = express.Router();
const _ = require("lodash");
const { User } = require("../models/user-model");

function validateRequest(req) {
    const schema = Joi.object({
        email: Joi.string()
            .lowercase()
            .email({
                minDomainSegments: 2,
                tlds: {
                    allows: ["com", "net"],
                },
            })
            .min(5)
            .max(255),
        password: Joi.string().min(8).max(255).required(),
    });

    return schema.validate(req.body);
}

router.post("/", async (req, res) => {
    // validating request
    const { error } = validateRequest(req);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send("Invalid email or password...");
    }

    const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!isValidPassword) {
        return res.status(400).send("Invalid email or password...");
    }
    // an object and a private key
    const token = user.generateAuthToken();

    res.send(token);
});

module.exports = router;
