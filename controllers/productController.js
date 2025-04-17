import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const saved = await product.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        const { keyword, category } = req.query;
        let filter = {};
        if (keyword) {
            filter.$or = [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { keywords: { $regex: keyword, $options: "i" } },
            ];
        }
        if (category) {
            filter.category = category;
        }
        const products = await Product.find(filter);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updated)
            return res.status(404).json({ message: "Product not found" });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
