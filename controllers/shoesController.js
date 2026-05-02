const Shoe = require("../models/Shoe");

const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {

    const {firstName, lastName, username, email, password} = req.body;

    // Check if user already exist
    const userExist = await User.findOne({ email });
    
    if(userExist){
        return res.json({
            success: false,
            message: "User already exist" 
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
    });

    await user.save();

    res.json({
        success: true,
        message: "User registered",
        user: {
            "id": user._id,
            "firstName": firstName,
            "lastName": lastName,
            "username": username,
            "email": email,

        },
    });
};


const loginUser = async (req, res) => {


    const {email, password} = req.body;

    const user = await User.findOne({email});
    
    if(!user) {
        return res.status(404).json({
            success: false,
            message: "User not found!"});
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    

    if(!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Wrong Password"});
    }

    const token = jwt.sign(
        {id: user._id},
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.json({
        success: true,
        message: "Login successful",
        user: {
            "id": user._id,
            "email": email,
        },
       token: token,
     });
};


const createShoe = async (req, res) => {

    const {id, name, category, brand, price, title, description, rating} = req.body;

    const sizes = JSON.parse(req.body.sizes);

    const image = req.file ? req.file.filename : null;

    const newShoe = new Shoe({
        id,
        name,
        category,     
        brand,
        price,
        title,
        description,
        sizes,
        image,
        rating 
    });

    const saveShoe = await newShoe.save();

    res.json({
        success: true,
        data: saveShoe
    });
};


const getAllShoes = async (req, res) => {
    const shoes = await Shoe.find();
    
    if(!shoes) {
        return res.status(500).json({
            success: false,
            message: "There is no Shoe Available at this moment!"
        });
    }

    res.json(
        {
            success: true,
            data: shoes
        }
        );
};


const getShoeById = async (req, res) => {

    try{
        const Id = req.params.id;

        const shoe = await Shoe.findById(Id);

        if(!shoe){
            return res.status(404).json({ message: "Shoe not found" });
        }

        res.json(
             {
            success: true,
            data: shoe
        }
        );

    } catch(error) {
        res.status(500).json({ 
            success: false,
            message: "Server error" });
    }

}


const updateShoe = async (req, res) => {

    try{

        console.log(req.body);
        const updatedShoe = await Shoe.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
        

        if(!updatedShoe){
            return res.status(404).json({ message: "Shoe not found" });
        }

        res.json({
            success: true,
            data: updatedShoe
        });

    } catch(e) {
        res.status(500).json({ 
            success: false,
            message: "Server error" });
    }    
    
}


const deleteShoe = async (req, res) => {

    try{

        const deletedShoe = await Shoe.findByIdAndDelete(req.params.id);

        if(!deletedShoe){
            return res.status(404).json({ message: "Shoe not found" });
        }

        res.json({ 
            success: true,
            message: "Shoe deleted successfully" }
        );

    } catch(e) {
        res.status(500).json({ 
            success: false,
            message: "Server error" });
    }
     
}




module.exports = {  registerUser, loginUser, getAllShoes, createShoe, getShoeById, updateShoe, deleteShoe};