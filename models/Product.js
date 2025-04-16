import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        images: [
            {
                url: { type: String, required: true },
                alt: { type: String },
            },
        ],
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        inventory: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: String,
            required: true,
            index: true,
        },
        keywords: [
            {
                type: String,
                index: true,
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
