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
        image: {
            url: {
                type: String,
                required: true,
                validate: {
                    validator: function (v) {
                        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
                    },
                    message: (props) => `${props.value} is not a valid URL!`,
                },
            },
            alt: {
                type: String,
                required: true,
                default: "Product image",
            },
        },
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
