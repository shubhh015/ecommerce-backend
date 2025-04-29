import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate(
            "items.product"
        );
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const addOrUpdateItem = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product)
            return res.status(404).json({ message: "Product not found" });

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart)
            cart = new Cart({ user: req.user._id, items: [], subTotal: 0 });

        const itemIndex = cart.items.findIndex((item) =>
            item.product.equals(productId)
        );
        if (itemIndex > -1) {
            if (quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            } else {
                cart.items[itemIndex].quantity = quantity;
                cart.items[itemIndex].price = product.price;

                cart.items[itemIndex].total = product.price * quantity;
            }
        } else if (quantity > 0) {
            cart.items.push({
                product: product,
                quantity,

                price: product.price,
                total: product.price * quantity,
            });
        }

        cart.subTotal = cart.items.reduce((sum, item) => sum + item.total, 0);
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const removeItem = async (req, res) => {
    const { productId } = req.params;
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(
            (item) => !item.product.equals(productId)
        );
        cart.subTotal = cart.items.reduce((sum, item) => sum + item.total, 0);
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const emptyCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = [];
        cart.subTotal = 0;
        await cart.save();
        res.json({ message: "Cart emptied", cart });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const updateShipping = async (req, res) => {
    const { shippingCost } = req.body;
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.shippingCost = shippingCost;
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const getCartItemByProductId = async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await Cart.findOne({ user: req.user._id }).populate(
            "items.product"
        );
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const cartItem = cart.items.find(
            (item) => item.product._id.toString() === productId
        );
        if (!cartItem)
            return res.status(404).json({ message: "Cart item not found" });

        res.json(cartItem);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
