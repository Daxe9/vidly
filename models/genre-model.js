const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
});

const Genre = mongoose.model("Genre", genreSchema);

function validateRequest(req) {
    const schema = Joi.object({
        genre: Joi.string().required(),
    });
    return schema.validate(req.body);
}

module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema;
module.exports.validateRequest = validateRequest;
