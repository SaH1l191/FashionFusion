import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to Jon Doe's account
    name: { type: String, required: true },
    category: { type: String },
    price: { type: Number, required: true },
    stockQuantity: { type: Number, default: 0 }, // Quantity available
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', default: null }, // Link to Supplier
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
