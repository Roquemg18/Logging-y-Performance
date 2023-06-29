const mongoose = require("mongoose");

const collectionName = "user";

const collectionSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  age: Number,
  password: String,
  phone: String,
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
});

const Users = mongoose.model(collectionName, collectionSchema);

module.exports = Users;
