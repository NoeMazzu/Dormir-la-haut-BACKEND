const mongoose = require("mongoose");

const userSchema = mongoose.Schema({});

const User = mongoose.model("users", userSchema);

module.exports = User;
