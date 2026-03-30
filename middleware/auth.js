const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;
    

    if(!authHeader) {
       return res.status(401).json({ message: "No token "});
    }

    // Splits 'Bearer' from actual token
    const token = authHeader.split(" ")[1];
    

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded;

        next();

    } catch (error) {
        console.log("JWT Error:", error.message);
        res.status(401).json({ message: "Invalid token "});
    }
};

module.exports = authMiddleware;