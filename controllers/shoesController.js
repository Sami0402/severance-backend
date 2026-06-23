const { json } = require("express");
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

const toggleWishlist = async(req, res) => {
    try{
        const user = await User.findById(req.user.id);
        

        const Id = String(req.params.id);


        let message = "";

        if ( user.wishlist.includes(Id) ) {
            const index = user.wishlist.indexOf(Id);

            if ( index !== -1 ){
                user.wishlist.splice(index, 1);
              
                message = "Removed from wishlist";
               
            }
            
        } else {
            user.wishlist.push(Id);
            
            message =  "Added to wishlist";
                
        }

        await user.save();

        res.status(200).json({
            success: true,
            wishlist: user.wishlist,
            message: message
        });

    } catch (e) {
        res.status(500).json({ 
            success: false,
            message: "Server error" });
    }
}

const getWishlist = async(req, res) => {
    try{
        const user = await User.findById(req.user.id);

        res.json(
        {
            success: true,
            wishlist: user.wishlist
        }
        );
        
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}


const addToCart = async(req, res) => {

    try{
        const user = await User.findById(req.user.id);

        const id = req.params.id;


        const { selectedSize } = req.body;

        const shoe = await Shoe.findOne({ id: id });

        if(!shoe){
            return res.status(400).json({
                message: "Shoe not found!"
            });
        }

        const cartShoe = user.cart.find( (cart)=> cart.id == id && cart.selectedSize == selectedSize);
        
        const cartShoeIndex = user.cart.findIndex( (cart)=> cart.id == id && cart.selectedSize == selectedSize );
        
        console.log(shoe.category);
        if (cartShoe){
            user.cart[cartShoeIndex].quantity += 1
        } else {
            user.cart.push({
                id: shoe.id,
                name: shoe.name,
                image: shoe.image,
                category: shoe.category,
                price: shoe.price,
                quantity: 1,
                selectedSize: selectedSize
            });
        }

        await user.save();

        res.json({
            message: 'Item Added into Cart',
            cart: user.cart
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Item Can't be added"
        })
    }
}

const cart = async(req, res) => {
      try {
        const user = await User.findById(req.user.id);

        if(!user) {
            return res.status(400).json({               
                message: "User not found"
            })
        }

        const cartItems = user.cart;

        res.status(200).json({
            success: true,
            cart : cartItems,
        });

      } catch(e) {
        res.status(404).json({
            message: "Something went wrong"
        })
      }
}

const updateCartItem = async(req, res) => {

    try {
        const user = await User.findById(req.user.id);

        if(!user) {
            return res.status(400).json({               
                message: "User not found"
            });
        }

        const cartItems = user.cart;

        const shoeId = req.params.id;

        const { selectedSize, action } = req.body;

        const shoe = cartItems.find((cart)=> cart.id == shoeId && cart.selectedSize == selectedSize);

        let message = "";

        if(!shoe) {
            return res.status(404).json({
                message : "Shoe not found"
            })
        }

        if(action == "increase"){
            shoe.quantity += 1; 
            message = "Shoe quantity increased";
        } else if(action == "decrease"){
            shoe.quantity -= 1; 
            message = "Shoe quantity decreased";
        } else {
            return res.status(400).json({
                message : "Invalid action"
            })
        }

        if(shoe.quantity <= 0){
            const index = user.cart.findIndex( (cart)=> cart.id == shoeId && cart.selectedSize == selectedSize);
            user.cart.splice(index, 1);
            message = "Shoe removed from cart";
        }

       await user.save();

        res.status(200).json({
            status: true,
            message: message,
            cart : user.cart
        });

        

    } catch(e){
        res.status(400).json({
            message: "Something went wrong",
        });
    }
}

const deleteCartItem = async(req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user){
            return res.status(404).json({
                message: "User not found"
            })
        }
        
        const shoeId = req.params.id;

        const { selectedSize } = req.body;


        const cartShoeIndex = user.cart.findIndex( (cart)=> cart.id == shoeId && cart.selectedSize == selectedSize);

        console.log(cartShoeIndex);

        if(cartShoeIndex === -1){
            return res.status(404).json({
                message: "Cart item not found"
            })
        }


        user.cart.splice(cartShoeIndex, 1);

        await user.save();

        res.status(200).json({
            success: true,
            message: "Shoe Deleted",
            cart: user.cart
        })
    } catch(e) {
        console.log(e);
        res.status(500).json({
            message: "Something went wrong" ,
        })
    }
}


module.exports = {  
    registerUser, loginUser, getAllShoes, createShoe, getShoeById, updateShoe, 
    deleteShoe, toggleWishlist, getWishlist, addToCart, cart, updateCartItem, deleteCartItem

};