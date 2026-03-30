const express = require("express");

const auth = require("../middleware/auth");

const upload = require("../middleware/upload");

const router = express.Router(); 

const {
    getAllShoes, createShoe, getShoeById, updateShoe, deleteShoe,
    registerUser, loginUser
} = require("../controllers/shoesController");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/shoes", getAllShoes);
router.get("/shoes/:id", getShoeById);

// Prrotected Routes
router.post("/shoes", auth, upload.single("image"), createShoe);
router.put("/shoes/:id",auth,upload.single("image"), updateShoe);
router.delete("/shoes/:id",auth, deleteShoe);

module.exports = router;