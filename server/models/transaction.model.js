import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to Jon Doe's account
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
        required: true
    }, // Product sold or purchased
    productName: { type: String }, // Name of the product at the time of transaction
    productPrice: { type: Number }, // Price of the product at the time of transaction
    quantity: { type: Number, required: true },
    transactionType: { type: String, enum: ['sale', 'purchase'], required: true },
    amount: { type: Number, required: true }, // Sale or Purchase Amount
    date: { type: Date, default: Date.now },
    supplier: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Supplier'
    }, // Link to the supplier for purchase transactions
}, { timestamps: true });

// Middleware to save product name and price before saving the transaction
transactionSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('product')) {
        const Product = mongoose.model('Product');
        const product = await Product.findById(this.product);
        if (product) {
            this.productName = product.name;
            this.productPrice = product.price;
        }
    }
    next();
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
