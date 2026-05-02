const express = require("express");

const connectDB = require("./config/db");

const shoesRoutes = require("./routes/shoesRoutes");

require("dotenv").config();

const PORT = process.env.PORT;

const app = express();

const errorHandler = require("./middleware/errorHandler");

connectDB();


// This enables JSON body parsing
app.use(express.json());

// This enables x-www-form-urlencoded parsing
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/", shoesRoutes);


// Must be at last to catch error, act as a middleware
app.use(errorHandler);

app.listen(PORT, "0.0.0.0", ()=> {
    console.log(`Server running on port ${PORT}`);
});