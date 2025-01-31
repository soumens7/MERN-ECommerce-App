const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 32
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        unique: 32
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    cart: {
        type: Array,
        default: []
    },
    history: {
        type: Array,
        default: []
    },
}, 
{ timestamps: true }
)

module.exports = mongoose.model("User", userSchema);