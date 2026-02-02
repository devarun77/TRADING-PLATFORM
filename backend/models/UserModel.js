const mongoose = require("mongoose");
const userSchema = require("../schemas/UserSchema");

const UserModel = new mongoose.model("UserModel", userSchema);

module.exports = UserModel;