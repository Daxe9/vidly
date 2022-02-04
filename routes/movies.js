const express = require("express");
const router = express.Router();
const { Movie, validateRequest } = require("../models/movie-model");
const { Genre } = require("../models/genre-model");
const auth = require("../middleware/authentication-middleware");
// get all list of movies
router.get("/", async (req, res) => {
    const movies = await Movie.find().sort("name");
    res.send(movies);
});
// get a single movie with corresponding id
router.get("/:id", async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
        return res.status(404).send("No movie was found with given ID...");
    }
    res.send(movie);
});
// create an new genres
router.post("/", auth, async (req, res) => {
    // validate the request
    const { error } = validateRequest(req);
    if (error) {
        // bad request
        return res.status(400).send(error.details[0].message);
    }
    // check if the movie already exist
    const movies = await Movie.find().sort({ name: 1 });
    let isExist = false;
    movies.forEach((movie) => {
        if (movie.title === req.body.title) {
            isExist = true;
        }
    });
    if (isExist) {
        return res.send("The movie exists already...");
    }
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) {
        return res.status(400).send("Invalid genre");
    }
    // create a new genre then add it to the list
    const newMovie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    });
    // save in the db
    await newMovie.save();
    res.send(newMovie);
});
// update a genre
router.put("/:movieID", auth, async (req, res) => {
    // validating the request
    let { error } = validateRequest(req);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // find a valid genre with given id
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) {
        return res.status(400).send("Invalid genre");
    }

    let movie = await Movie.findByIdAndUpdate(
        req.params.movieID,
        {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name,
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
        },
        {
            new: true,
        }
    );

    if (!movie) {
        // not found
        return res.status(404).send("The user does not exist");
    }
    res.send(movie);
});
// delete a route
router.delete("/:movieID", auth, async (req, res) => {
    let result = await Movie.findByIdAndDelete(req.params.movieID);

    if (!result) {
        return res.status(404).send("No movie was found with given ID");
    }

    res.send(result);
});
module.exports = router;
