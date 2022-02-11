const express = require("express");
const { Customer, validateRequest } = require("../models/customer-model");
const router = express.Router();
const auth = require("../middleware/authentication-middleware");
// get the list of genres
router.get("/", async (req, res) => {
    const customers = await Customer.find().sort({ name: 1 });
    res.send(customers);
});
// get a single genre with corresponding id
router.get("/:id", auth, async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
        return res.status(404).send("No customer was found with given ID...");
    }
    res.send(customer);
});
// create an new genres
router.post("/", auth, async (req, res) => {
    // validate the request
    const { error } = validateRequest(req);
    if (error) {
        // bad request
        return res.status(400).send(error.details[0].message);
    }
    // check if the user already exist
    const customers = await Customer.find().sort({ name: 1 });
    let isExist = false;
    customers.forEach((customer) => {
        if (customer.name === req.body.name) {
            isExist = true;
        }
    });
    if (isExist) {
        return res.send("The user exists already...");
    }
    // create a new genre then add it to the list
    const newCustomer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
    });
    // save in the db
    newCustomer.save();
    res.send(newCustomer);
});
// update a genre
router.put("/:id", auth, async (req, res) => {
    // validating the request
    let { error } = validateRequest(req);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let customer = await Customer.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone,
        },
        {
            new: true,
        }
    );

    if (!customer) {
        // not found
        return res.status(404).send("The user does not exist");
    }
    res.send(customer);
});
// delete a route
router.delete("/:id", auth, async (req, res) => {
    let result = await Customer.findByIdAndDelete(req.params.id);

    if (!result) {
        return res.status(404).send("No user was found with given ID");
    }

    res.send(result);
});
module.exports = router;
