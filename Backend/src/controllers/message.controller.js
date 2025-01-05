import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: {$ne: loggedInUserId}}).select("-password");
        /* Extracting all the details except password out of it */

        res.status(200).json( filteredUsers );
    } catch (error) {
        console.log(`Error in getUsersForSidebar controller: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error!"});
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: userToChatId},
                { senderId: userToChatId, receiverId: senderId}
            ]
        });

        res.status(200).json(messages);

    } catch (error) {
        console.log(`Error in getMessages controller: ${error.message}`);   
        res.status(500).json({ message: "Internal Server Error!"});
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        const { text, image } = req.body;

        let imageUrl;
        if(image) {
            const uploadedResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadedResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(200).json(newMessage);
        
    } catch (error) {
        console.log(`Error in sendMessage controller: ${error.message}`);   
        res.status(500).json({ message: "Internal Server Error!"});
    }
}