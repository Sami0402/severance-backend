const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {   
        firstName: String,
        lastName: String,
        username: String,
        email: String,
        password: String,
        wishlist: [String],
        cart: [
            {
                id : { type: Number, required: true },
                name : { type: String, required: true },
                image : { type: String, required: true },
                price : { type: Number, required: true },
                quantity : { type: Number, required : true },
                selectedSize : { type: String , required : true },

            }
        ]
    }
);

module.exports = mongoose.model("User", userSchema);