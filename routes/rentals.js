const express = require("express");
const router = express.Router();
const { Rental, validateRequest } = require("../models/rental-model");
const { Customer } = require("../models/customer-model");
const { Movie } = require("../models/movie-model");
const mongoose = require("mongoose");
const auth = require("../middleware/authentication-middleware");
// get all list of rentals
router.get("/", auth, async (req, res) => {
    const rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
});
/*
customerId
movieId
*/
// create a new rental
router.post("/", auth, async (req, res) => {
    // validate the request
    const { error } = validateRequest(req);
    if (error) {
        // bad request
        return res.status(400).send(error.details[0].message);
    }

    const customer = await Customer.findById(req.body.customerId);
    const movie = await Movie.findById(req.body.movieId);
    if (!movie || !customer) {
        return res
            .status(400)
            .send("The customer or movie with given ID was not found");
    }

    if (movie.numberInStock === 0) {
        return res.status(400).send("Movie is not in stock");
    }

    // not pass the found customer or movie because there is a version property
    let newRental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
        },
    });

    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            // save a new rental in the db
            newRental = await newRental.save({ session });
            --movie.numberInStock;
            // update the movie
            await movie.save({ session });
            res.send(newRental);
        });

        await session.endSession();
        console.log("Transaction done...");
    } catch (err) {
        res.status(500).send("Something has failed");
        console.error("Transaction failed...");
    }

    // decrease numberInStock of the movie
});

module.exports = router;
