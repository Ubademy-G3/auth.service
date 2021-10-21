const mongoose = require("./mongoose");

const userSchema = mongoose.Schema({
    //_id: mongoose.ObjectId, lo hace automaticamente mongoDB
    email: String,
    password: String,
    token: String
});

module.exports = mongoose.model('User', userSchema);