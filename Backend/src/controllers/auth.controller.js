import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required!"});
        }

        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters long!"});
        }
        const user = await User.findOne({ email });
        if(user) res.status(400).json({ message: "User is already registered!"});


        const salt = await bcrypt.genSalt(10); /* 10 is the saltRound. It can be any +ve int */
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword
        });

        if(newUser) {
            /* newUser is created successfully */
            /* Let us generate the token now */
            generateToken(newUser._id, res);
            await newUser.save();
            
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
            /* Status code 201 means that a new resource is created */
        } else {
            res.status(400).json({ message: "User could not be created!"});
        }
    } catch(error) {
        console.log(`Error in signup controller: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error!"});
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if(!email || !password) {
            return res.status(400).json({ message: "All fields are required!"});
        }
        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({ message: "Invalid credentials!"});

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials!"});

        generateToken(user._id, res);
        res.status(200).json({ 
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic
        });
    } catch(error) {
        console.log(`Error in login controller: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error!"});
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        /* possible because of the cookie-parser package */
        res.status(200).json({ message: "Logged out successfully!"});
    } catch(error) {
        console.log(`Error in logout controller: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error!"});
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id; /* We are getting this from the protectRoute middleware */

        if(!profilePic) {
            res.status(400).json({ message: "Profile picture is required!"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url,
        }, { new: true});

        res.status(200).json({ message: "Profile updated successfully!", updatedUser});

    } catch(error) {
        console.log(`Error in updateProfile controller: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error!"});
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch(error) {
        console.log(`Error in checkAuth controller: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error!"});
    }
}