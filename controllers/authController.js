import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
dotenv.config();
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const signup = async (req, res) => {
    const { name, phone, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists)
            return res.status(400).json({ message: "User already exists" });

        const user = await User.create({ name, phone, email, password });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                role: user.role,
                joined: user.joinedFormatted,
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
