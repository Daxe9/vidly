const express = require("express");
const auth = require("../middleware/authentication-middleware");
const admin = require("../middleware/admin");
const { Genre, validateRequest } = require("../models/genre-model");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");
const asyncMiddleware = require("../middleware/async");
// get the list of genres

router.get(
    "/",
    asyncMiddleware(async (req, res) => {
        const genres = await Genre.find().sort({ name: 1 });
        res.send(genres);
    })
);
// get a single genre with corresponding id
router.get(
    "/:id",
    validateObjectId,
    asyncMiddleware(async (req, res) => {
        const genre = await Genre.findById(req.params.id);
        if (!genre) {
            return res.status(404).send("No genre was found with given ID...");
        }
        res.send(genre);
    })
);
// create an new genres
router.post(
    "/",
    auth,
    asyncMiddleware(async (req, res) => {
        // validate the request
        const { error } = validateRequest(req);
        if (error) {
            // bad request
            return res.status(400).send(error.details[0].message);
        }
        // create a new genre then add it to the list
        const newGenre = new Genre({
            name: req.body.genre,
        });
        // save in the db
        newGenre.save();
        res.send(newGenre);
    })
);
// update a genre
router.put(
    "/:id",
    [auth, validateObjectId],
    asyncMiddleware(async (req, res) => {
        // validating the request
        let { error } = validateRequest(req);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        let genre = await Genre.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.genre,
            },
            {
                new: true,
            }
        );
        if (!genre) {
            // not found
            return res.status(404).send("The genre does not exist");
        }
        res.send(genre);
    })
);
// delete a route
router.delete(
    "/:id",
    [auth, admin, validateObjectId],
    asyncMiddleware(async (req, res) => {
        let result = await Genre.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.send("No genre was found with given ID");
        }
        res.send("Genre deleted successfully.");
    })
);
module.exports = router;
