const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

function validateRequest(req) {
    const schema = Joi.object({
        username: Joi.string().required().min(3).max(30),
        email: Joi.string()
            .email({
                minDomainSegments: 2,
                tlds: {
                    allows: ["com", "net"],
                },
            })
            .min(5)
            .max(255),
        password: Joi.string().min(8).max(255).required(),
        isAdmin: Joi.boolean(),
    });

    return schema.validate(req.body);
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 3,
        maxlength: 30,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        minlength: 5,
        maxlength: 255,
        // convert it to lowercase
        lowercase: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 1024,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, isAdmin: this.isAdmin },
        config.get("jwtPrivateKey")
    );
    return token;
};

const User = mongoose.model("User", userSchema);

exports.User = User;
exports.validateRequest = validateRequest;
