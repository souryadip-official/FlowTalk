import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) return res.status(401).json({ message: "Unauthorized - No Token Provided!"});

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) return res.status(401).json({ message: "Unauthorized - Invalid Token!"});

        const user = await User.findById(decoded.userId).select("-password");
        /* This means, we do not want to retutn the password back to the client,
        so we are storing the user by removing the password from the user object 
        and is done using .select("-<fieldName>") */

        /* The following is done just to make our code more robust */
        if(!user) return res.status(404).json({ message: "User not found!"});

        req.user = user;
        next();
    } catch (error) {
        console.log(`Error in protectRoute middleware: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error!"});
    }
}