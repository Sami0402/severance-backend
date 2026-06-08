const express = require("express");

const auth = require("../middleware/auth");

const upload = require("../middleware/upload");

const router = express.Router(); 

const {
    getAllShoes, createShoe, getShoeById, updateShoe, deleteShoe,
    registerUser, loginUser,
    toggleWishlist,
    getWishlist,
    addToCart,
    cart,
    updateCartItem,
    deleteCartItem
} = require("../controllers/shoesController");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/shoes", getAllShoes);
router.get("/shoes/:id", getShoeById);

// Prrotected Routes
router.post("/shoes", auth, upload.single("image"), createShoe);
router.put("/shoes/:id",auth,upload.single("image"), updateShoe);
router.delete("/shoes/:id",auth, deleteShoe);
router.post("/wishlist/toggle/:id", auth, toggleWishlist);
router.get("/wishlist", auth, getWishlist);
router.post("/addToCart/:id", auth, addToCart);
router.get("/cart", auth, cart);
router.patch("/cart/:id", auth, updateCartItem);
router.delete("/cart/:id", auth, deleteCartItem);


module.exports = router;