import User from "../models/User.js";

// GET /api/profile - Get current user's profile
export const getProfile = async (req, res) => {
    try {
        // req.user is set by authMiddleware
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// PUT /api/profile - Update current user's profile
export const updateProfile = async (req, res) => {
    try {
        const { name, email, avatar } = req.body;
        // Only allow updating specific fields
        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (email) updatedFields.email = email;
        if (avatar) updatedFields.avatar = avatar;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updatedFields },
            { new: true, runValidators: true, select: "-password" }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
