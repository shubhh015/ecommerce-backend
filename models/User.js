import bcrypt from "bcryptjs";
import mongoose from "mongoose";
const addressSchema = new mongoose.Schema(
    {
        name: String,
        address: String,
        city: String,
        state: String,
        country: String,
        pincode: String,
        phone: String,
        default: { type: Boolean, default: false },
    },
    { _id: true }
);

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    joined: {
        type: Date,
        default: Date.now,
    },
    addresses: [addressSchema],
    role: {
        type: String,
        enum: ["user", "admin", "moderator"],
        default: "user",
        required: true,
    },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
userSchema.virtual("joinedFormatted").get(function () {
    const options = { year: "numeric", month: "long" };
    return this.joined.toLocaleDateString("en-US", options);
});
userSchema.set("toJSON", { virtuals: true });
userSchema.methods.matchPassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
