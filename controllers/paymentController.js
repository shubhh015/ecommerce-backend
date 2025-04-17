import dotenv from "dotenv";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
dotenv.config();
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
    try {
        const { amount, currency = "INR", receipt = "receipt#1" } = req.body;
        const options = {
            amount: amount * 100,
            currency,
            receipt,
        };
        const razorpayOrder = await razorpay.orders.create(options);

        const dbOrder = await Order.create({
            user: req.user._id,
            razorpayOrderId: razorpayOrder.id,
            amount,
            currency,
            receipt,
            status: razorpayOrder.status,
        });

        res.status(201).json({
            razorpayOrder,
            dbOrder,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
