const mongoose = require("mongoose");

// objectId is formed by 12 bytes
//  4 bytes: timestamp
//  3 bytes: machine identifier
//  2 bytes: process identifier
//  3 bytes: counter

// two documents could have the same object ID,
// which is actually assign by the mongoDB drive
// but it's very rare

// to create a object id
const id = mongoose.Types.ObjectId();
console.log(id);

// we can get the time stamp using method getTimestamp
console.log(id.getTimestamp());

// to check if a object id is valid, usa static method isValid
const isValid = mongoose.Types.ObjectId.isValid(id);
console.log(isValid);
