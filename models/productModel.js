const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        product_id: {
        type: String,
        unique: true,
        required: true,
        },
        title: {
        type: String,
        trim: true,
        required: true,
        maxLength: 32,
        },
        price: {
        type: Number,
        required: true,
        },
        description: {
        type: String,
        required: true,
        maxLength: 2000,
        },
        content: {
        type: String,
        required: true,
        },
        images: {
        type: Object,
        required: true,
        },
        category: {
        type: String,
        required: true,
        },
        checked: {
        type: Boolean,
        default: false,
        },
        sold: {
        type: Number,
        default: 0,
        },
    },
    { timestamps: true }
    );    

    module.exports = mongoose.model("Product", productSchema);