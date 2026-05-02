const mongoose = require("mongoose");

const shoeSchema = new mongoose.Schema({
    id : Number,
    name: String,
    category : String,
    brand: String,
    price: Number,
    image: String,
    title: String,
    description: String,
    sizes: [
        {
            size : { type: String, required: true },
            isSelected : { type: Boolean, required: true }
        }
    ],
    rating: Number

});

module.exports = mongoose.model("Shoe", shoeSchema);