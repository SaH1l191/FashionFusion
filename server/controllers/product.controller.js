import Product from "../models/product.model.js";
import Supplier from "../models/supplier.model.js";
import Transaction from "../models/transaction.model.js";

// Create a new product or update if exists
export const createProduct = async (req, res) => {
    try {
        const { name, category, price, stockQuantity, supplier, transactionType } = req.body;

        if (!name || !price || !transactionType) {
            return res.status(400).json({ message: "Name, price, and transaction type are required" });
        }

        if (transactionType !== 'purchase' && transactionType !== 'sale') {
            return res.status(400).json({ message: "Transaction type must be either 'purchase' or 'sale'" });
        }

        // Check if supplier exists
        let supplierDoc = null;
        if (supplier) {
            supplierDoc = await Supplier.findById(supplier);
            if (!supplierDoc) {
                return res.status(400).json({ message: "Supplier not found" });
            }
        }
        console.log(supplierDoc)

        // Check if product already exists
        let product = await Product.findOne({ name, adminId: req.user._id });
        let isNewProduct = false;

        if (product) {
            // Update existing product
            product.category = category;
            product.price = price;
            product.supplier = supplier;

            // Check if sale quantity exceeds available stock
            if (transactionType === 'sale' && stockQuantity > product.stockQuantity) {
                return res.status(400).json({ message: "Sale quantity cannot exceed available stock" });
            }
        } else {
            // Create new product
            product = new Product({
                adminId: req.user._id,
                name,
                category,
                price,
                stockQuantity: 0, // Initialize with 0, will be updated later
                supplier,
            });
            isNewProduct = true;

            // For new products, only allow purchase transactions
            if (transactionType === 'sale') {
                return res.status(400).json({ message: "Cannot create a new product with a sale transaction" });
            }
        }

        // Update supplier's productsSupplied array if it's a new product
        if (isNewProduct && supplierDoc) {
            await Supplier.findByIdAndUpdate(supplier, {
                $addToSet: { productsSupplied: product._id }
            });
        }

        // Create a transaction for stock change
        if (stockQuantity !== 0) {
            const newTransaction = new Transaction({
                adminId: req.user._id,
                product: product._id,
                productName: product.name,
                productPrice: product.price,
                quantity: Math.abs(stockQuantity),
                transactionType: transactionType,
                amount: price * Math.abs(stockQuantity),
                date: new Date(),
                supplier: supplierDoc ? supplierDoc._id : null
            });
            await newTransaction.save();

            // Update stock quantity based on transaction type
            if (transactionType === 'purchase') {
                product.stockQuantity += stockQuantity;
            } else if (transactionType === 'sale') {
                product.stockQuantity -= stockQuantity;
            }
        }

        await product.save();

        res.status(201).json({ 
            message: isNewProduct ? "Product created successfully" : "Product updated successfully", 
            product: product 
        });
    } catch (error) {
        console.error("Error creating/updating product:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ adminId: req.user._id }).populate('supplier');
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, adminId: req.user._id }).populate('supplier');

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
    try {
        const { name, category, price, stockQuantity, supplier, transactionType } = req.body;

        if (!transactionType || (transactionType !== 'purchase' && transactionType !== 'sale')) {
            return res.status(400).json({ message: "Transaction type must be either 'purchase' or 'sale'" });
        }

        const product = await Product.findOne({ _id: req.params.id, adminId: req.user._id });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // If supplier is changed, update both old and new supplier's productsSupplied
        if (supplier && (!product.supplier || supplier !== product.supplier.toString())) {
            // Remove product from old supplier's productsSupplied
            if (product.supplier) {
                await Supplier.findByIdAndUpdate(product.supplier, {
                    $pull: { productsSupplied: product._id }
                });
            }
            // Add product to new supplier's productsSupplied
            await Supplier.findByIdAndUpdate(supplier, {
                $addToSet: { productsSupplied: product._id }
            });
        }

        // Calculate stock difference
        const stockDifference = stockQuantity - product.stockQuantity;

        // Check if the sale quantity is less than or equal to available quantity
        if (transactionType === 'sale' && stockDifference < 0 && Math.abs(stockDifference) > product.stockQuantity) {
            return res.status(400).json({ message: "Sale quantity cannot exceed available stock" });
        }

        // Update the product
        product.name = name;
        product.category = category;
        product.price = price;
        product.stockQuantity = stockQuantity;
        product.supplier = supplier;

        const updatedProduct = await product.save();

        // Create a new transaction for the update
        const supplierDoc = await Supplier.findById(supplier);
        const newTransaction = new Transaction({
            adminId: req.user._id,
            product: updatedProduct._id,
            productName: updatedProduct.name,
            productPrice: updatedProduct.price,
            quantity: Math.abs(stockDifference),
            transactionType: transactionType,
            amount: price * Math.abs(stockDifference),
            date: new Date(),
            supplier: supplierDoc ? supplierDoc._id : null
        });
        await newTransaction.save();

        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete({ _id: req.params.id, adminId: req.user._id });

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Remove product from supplier's productsSupplied
        if (deletedProduct.supplier) {
            await Supplier.findByIdAndUpdate(deletedProduct.supplier, {
                $pull: { productsSupplied: deletedProduct._id }
            });
        }

        // Delete all transactions related to this product
        await Transaction.deleteMany({ product: deletedProduct._id });

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get top trending product for the user
export const getTopTrendingProduct = async (req, res) => {
    try {
        const topProduct = await Transaction.aggregate([
            { $match: { adminId: req.user._id } },
            { $group: {
                _id: "$product",
                totalQuantity: { $sum: "$quantity" },
                totalAmount: { $sum: "$amount" }
            }},
            { $sort: { totalQuantity: -1 } },
            { $limit: 1 },
            { $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productDetails"
            }},
            { $unwind: "$productDetails" }
        ]);

        if (topProduct.length === 0) {
            return res.status(404).json({ message: "No trending product found" });
        }

        res.status(200).json({
            message: "Top trending product retrieved successfully",
            product: {
                ...topProduct[0].productDetails,
                totalQuantitySold: topProduct[0].totalQuantity,
                totalAmountSold: topProduct[0].totalAmount
            }
        });
    } catch (error) {
        console.error("Error fetching top trending product:", error);
        res.status(500).json({ message: "Server error" });
    }
};
