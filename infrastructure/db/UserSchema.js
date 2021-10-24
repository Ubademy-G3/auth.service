const mongoose = require("./mongoose");
const hash = require("../security/HashManager");

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: false
    },
    //hash: String,
    salt: String
});

//userSchema.methods.setPassword = hash.setPassword;
//userSchema.methods.validPassword = hash.validPassword;

module.exports = mongoose.model('User', userSchema);