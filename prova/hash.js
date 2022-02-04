const bcrypt = require("bcrypt");

// need a salt, random string added before or after the string
// the result will be different based on salt used everytime
async function run() {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash("Davidexie0609", salt);
    console.log(salt);
    console.log(hashedPass);
}

run();
