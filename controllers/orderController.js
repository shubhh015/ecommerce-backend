import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress } = req.body;
        const order = new Order({
            user: req.user._id,
            items,
            totalAmount,
            shippingAddress,
        });
        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate(
            "items.productId"
        );
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            "items.productId"
        );
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createGuestOrder = async (req, res) => {
    try {
        const { items, shippingAddress, contact, shippingCost, paymentInfo } =
            req.body;

        // Validate items and calculate total
        let total = 0;
        const orderItems = [];
        for (let item of items) {
            const product = await Product.findById(item.productId);
            if (!product)
                return res
                    .status(400)
                    .json({ message: "Invalid product in cart" });
            const itemTotal = product.price * item.quantity;
            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price,
                total: itemTotal,
            });
            total += itemTotal;
        }
        total += shippingCost || 0;

        // Create order (without user field)
        const order = new Order({
            items: orderItems,
            shippingAddress,
            contact,
            shippingCost,
            total,
            paymentInfo,
            status: "pending",
            isGuest: true,
        });
        await order.save();
        res.status(201).json({ orderId: order._id });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
