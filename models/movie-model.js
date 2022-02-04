const mongoose = require("mongoose");
const Joi = require("joi");
const { MongoMissingCredentialsError } = require("mongodb");

const { genreSchema } = require("./genre-model");

const Movie = mongoose.model(
    "Movie",
    new mongoose.Schema({
        title: { type: String, trim: true, required: true, maxlength: 100 },
        genre: {
            type: genreSchema,
            required: true,
        },
        numberInStock: {
            type: Number,
            required: true,
            min: 0,
        },
        dailyRentalRate: {
            type: Number,
            required: true,
            min: 0,
        },
    })
);

function validateRequest(req) {
    const schema = Joi.object({
        title: Joi.string().max(100).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required(),
    });

    return schema.validate(req.body);
}

module.exports.Movie = Movie;
module.exports.validateRequest = validateRequest;
