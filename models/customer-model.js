const Joi = require("joi");
const mongoose = require("mongoose");
const Customer = mongoose.model(
    "Customer",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        isGold: {
            type: Boolean,
            default: false,
        },
        phone: {
            type: String,
            required: true,
        },
    })
);
function validateRequest(request) {
    let schema = Joi.object({
        name: Joi.string().required(),
        isGold: Joi.boolean(),
        phone: Joi.string().required(),
    });

    return schema.validate(request.body);
}
module.exports.Customer = Customer;
module.exports.validateRequest = validateRequest;
