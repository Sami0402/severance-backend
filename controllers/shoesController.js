const Shoe = require("../models/Shoe");

const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {

    const {firstName, lastName, username, email, password} = req.body;

    // Check if user already exist
    const userExist = await User.findOne({ email });
    
    if(userExist){
        return res.json({ message: "User already exist" });
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

    res.json({message: "User registered"});
};


const loginUser = async (req, res) => {


    const {email, password} = req.body;

    const user = await User.findOne({email});
    
    if(!user) {
        return res.status(400).json({
            success: false,
            message: "User not found"});
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    

    if(!isMatch) {
        return res.status(400).json({
            success: fals,
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

    const {name, brand, price} = req.body;

    const image = req.file ? req.file.filename : null;

    const newShoe = new Shoe({
        name,
        brand,
        price,
        image
    });

    const saveShoe = await newShoe.save();

    res.json({
        success: true,
        data: saveShoe
    });
};


const getAllShoes = async (req, res) => {
    const shoes = await Shoe.find();
    
    res.json(shoes);
};


const getShoeById = async (req, res) => {

    try{
        const Id = req.params.id;

        const shoe = await Shoe.findById(Id);

        if(!shoe){
            return res.status(404).json({ message: "Shoe not found" });
        }

        res.json(shoe);

    } catch(error) {
        res.status(500).json({ message: "Server error" });
    }

}


const updateShoe = async (req, res) => {

    try{

        console.log(req.body);
        const updatedShoe = await Shoe.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });


        if(!updatedShoe){
            return res.status(404).json({ message: "Shoe not found" });
        }

        res.json(updatedShoe);

    } catch(e) {
        res.status(500).json({ message: "Server error" });
    }    
    
}


const deleteShoe = async (req, res) => {

    try{

        const deletedShoe = await Shoe.findByIdAndDelete(req.params.id);

        if(!deletedShoe){
            return res.status(404).json({ message: "Shoe not found" });
        }

        res.json({ message: "Shoe deleted successfully" });

    } catch(e) {
        res.status(500).json({ message: "Server error" });
    }
     
}




module.exports = {  registerUser, loginUser, getAllShoes, createShoe, getShoeById, updateShoe, deleteShoe};