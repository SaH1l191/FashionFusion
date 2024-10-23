import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to Jon Doe's account
    name: { type: String, required: true },
    contactInfo: { type: String },
    address: { type: String },
    productsSupplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Products supplied
}, { timestamps: true });

const Supplier = mongoose.model("Supplier", supplierSchema);
export default Supplier;
