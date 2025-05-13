import dotenv from "dotenv";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const updateInventoryOnOrder = async (products, session) => {
    for (const item of products) {
        if (!item || !item.product || !item.product._id) {
            throw new Error("Invalid product in order request");
        }
        const product = await Product.findById(item?.product?._id).session(
            session
        );
        if (!product) {
            throw new Error(`Product not found: ${item?.product?._id}`);
        }
        const newInventory = product.inventory - item.quantity;
        product.inventory = Math.max(newInventory, 0);
        if (product.inventory === 0) {
            product.isActive = false;
        }
        await product.save({ session });
    }
};

export const createOrder = async (req, res) => {
    const session = await Product.startSession();
    session.startTransaction();
    try {
        const {
            amount,
            currency = "INR",
            receipt = "receipt#1",
            products,
            shippingAddress,
        } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res
                .status(400)
                .json({ message: "Products are required to create an order" });
        }
        if (
            products.some(
                (item) =>
                    !item ||
                    typeof item.quantity !== "number" ||
                    !item.product ||
                    !item.product._id
            )
        ) {
            return res
                .status(400)
                .json({ message: "Invalid products array in request" });
        }

        const orderItems = [];
        for (const item of products) {
            if (!item || !item.product || !item.product._id) {
                throw new Error("Invalid product in order request");
            }
            const product = await Product.findById(item.product._id).session(
                session
            );
            if (!product) {
                throw new Error(`Product not found: ${item?.product?._id}`);
            }
            orderItems.push({
                productId: product._id,
                name: product.name,
                quantity: item.quantity,
                price: product.price,
            });
        }

        const options = {
            amount: amount * 100,
            currency,
            receipt,
        };
        const razorpayOrder = await razorpay.orders.create(options);

        const dbOrder = await Order.create(
            [
                {
                    user: req.user._id,
                    items: orderItems,
                    totalAmount: amount,
                    status: "pending",
                    paymentInfo: {
                        id: razorpayOrder.id,
                        method: "razorpay",
                        status: razorpayOrder.status,
                    },
                    shippingAddress,
                },
            ],
            { session }
        );

        await updateInventoryOnOrder(products, session);

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            razorpayOrder,
            dbOrder: dbOrder[0],
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
};
