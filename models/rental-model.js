// customer --> name, isGold, phone
// movie --> title, dailyRentalRate
// dateOut
// dateReturned
// rentalFee

const mongoose = require("mongoose");
const Joi = require("joi");
const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                maxlength: 100,
            },
            isGold: {
                type: Boolean,
                default: false,
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 20,
            },
        }),
        required: true,
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                maxlength: 100,
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                max: 255,
            },
        }),
        required: true,
    },
    dateOut: {
        type: Date,
        default: Date.now,
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        default: 0,
        min: 0,
    },
});
function validateRequest(req) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    });
    return schema.validate(req.body);
}
const Rental = mongoose.model("Rental", rentalSchema);

module.exports.Rental = Rental;
module.exports.validateRequest = validateRequest;
