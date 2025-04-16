import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [orderItemSchema],
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        paymentInfo: {
            id: String,
            method: String,
            status: String,
        },
        shippingAddress: {
            address: String,
            city: String,
            postalCode: String,
            country: String,
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
