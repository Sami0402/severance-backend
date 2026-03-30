const mongoose = require("mongoose");

const shoeSchema = new mongoose.Schema({
    name: String,
    brand: String,
    price: Number,
    image: String
});

module.exports = mongoose.model("Shoe", shoeSchema);