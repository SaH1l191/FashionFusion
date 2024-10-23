import Transaction from "../models/transaction.model.js";
import Product from "../models/product.model.js";
import Supplier from "../models/supplier.model.js";

// Create a new transaction
export const createTransaction = async (req, res) => {
    try {
        const { product, quantity, transactionType, amount, supplier } = req.body;

        if (!product || !quantity || !transactionType || !amount) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const productDoc = await Product.findById(product);
        if (!productDoc) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (transactionType === 'sale' && productDoc.stockQuantity < quantity) {
            return res.status(400).json({ message: "Not enough stock for this sale" });
        }

        let supplierDoc = null;
        if (supplier && supplier.trim() !== '') {
            supplierDoc = await Supplier.findById(supplier);
            if (!supplierDoc) {
                return res.status(404).json({ message: "Supplier not found" });
            }
        }

        const newTransaction = new Transaction({
            adminId: req.user._id,
            product: product,
            productName: productDoc.name,
            productPrice: productDoc.price,
            quantity,
            transactionType,
            amount,
            date: new Date(),
            supplier: supplierDoc ? supplierDoc._id : null
        });

        await newTransaction.save();

        if (transactionType === 'sale') {
            await Product.findByIdAndUpdate(product, { $inc: { stockQuantity: -quantity } });
        } else if (transactionType === 'purchase') {
            await Product.findByIdAndUpdate(product, { $inc: { stockQuantity: quantity } });
        }

        res.status(201).json({ message: "Transaction created successfully", transaction: newTransaction });
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all transactions
export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ adminId: req.user._id })
            .populate('product')
            .populate({
                path: 'supplier',
                select: 'name'
            })
            .sort({ date: -1 }) 
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// Get product summary (name, quantity, stock, transaction type)
export const getProductSummary = async (req, res) => {
    try {
        const productSummary = await Transaction.aggregate([
            { $match: { adminId: req.user._id } },
            {
                $group: {
                    _id: "$product",
                    productName: { $first: "$productName" },
                    totalQuantity: { $sum: "$quantity" },
                    lastTransactionDate: { $max: "$date" },
                    lastTransactionType: { $last: "$transactionType" }
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            { $unwind: "$productInfo" },
            {
                $project: {
                    productName: 1,
                    totalQuantity: 1,
                    stock: "$productInfo.stockQuantity",
                    lastTransactionDate: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$lastTransactionDate"
                        }
                    },
                    transactionType: "$lastTransactionType"
                }
            },
            { $sort: { lastTransactionDate: -1 } } 
        ]);

        res.status(200).json(productSummary);
    } catch (error) {
        console.error("Error fetching product summary:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get a single transaction by ID
export const getTransactionById = async (req, res) => {
    try {
        const id = req.params.id.trim();
        if (!id) {
            return res.status(400).json({ message: "Invalid transaction ID" });
        }

        const transaction = await Transaction.findOne({ _id: id, adminId: req.user._id })
            .populate('product')
            .populate({
                path: 'supplier',
                select: 'name'
            });

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json(transaction);
    } catch (error) {
        console.error("Error fetching transaction:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid transaction ID format" });
        }
        res.status(500).json({ message: "Server error" });
    }
};

// Update a transaction by ID
export const updateTransaction = async (req, res) => {
    try {
        const { product, quantity, transactionType, amount, supplier } = req.body;
        const productDoc = await Product.findById(product);
        if (!productDoc) {
            return res.status(404).json({ message: "Product not found" });
        }

        let supplierDoc = null;
        if (supplier && supplier.trim() !== '') {
            supplierDoc = await Supplier.findById(supplier);
            if (!supplierDoc) {
                return res.status(404).json({ message: "Supplier not found" });
            }
        }

        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, adminId: req.user._id },
            { 
                product, 
                productName: productDoc.name,
                productPrice: productDoc.price,
                quantity, 
                transactionType, 
                amount,
                date: new Date(),
                supplier: supplierDoc ? supplierDoc._id : null
            },
            { new: true }
        )
        .populate('product')
        .populate({
            path: 'supplier',
            select: 'name'
        });

        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        if (transactionType === 'sale') {
            await Product.findByIdAndUpdate(product, { $inc: { stockQuantity: -quantity } });
        } else if (transactionType === 'purchase') {
            await Product.findByIdAndUpdate(product, { $inc: { stockQuantity: quantity } });
        }

        res.status(200).json({ message: "Transaction updated successfully", transaction: updatedTransaction });
    } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete a transaction by ID
export const deleteTransaction = async (req, res) => {
    try {
        const deletedTransaction = await Transaction.findOneAndDelete({ _id: req.params.id, adminId: req.user._id });

        if (!deletedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        if (deletedTransaction.transactionType === 'sale') {
            await Product.findByIdAndUpdate(deletedTransaction.product, { $inc: { stockQuantity: deletedTransaction.quantity } });
        } else if (deletedTransaction.transactionType === 'purchase') {
            await Product.findByIdAndUpdate(deletedTransaction.product, { $inc: { stockQuantity: -deletedTransaction.quantity } });
        }

        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get total profit
export const getTotalProfit = async (req, res) => {
    try {
        const transactions = await Transaction.find({ adminId: req.user._id });
        
        let totalProfit = 0;
        transactions.forEach(transaction => {
            if (transaction.transactionType === 'sale') {
                totalProfit += transaction.amount;
            } else if (transaction.transactionType === 'purchase') {
                totalProfit -= transaction.amount;
            }
        });

        res.status(200).json(totalProfit);
    } catch (error) {
        console.error("Error calculating total profit:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get monthly profit
export const getMonthlyProfit = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const transactions = await Transaction.find({
            adminId: req.user._id,
            date: {
                $gte: new Date(currentYear, 0, 1),
                $lt: new Date(currentYear + 1, 0, 1)
            }
        });

        let monthlyProfit = new Array(12).fill(0);

        transactions.forEach(transaction => {
            const month = new Date(transaction.date).getMonth();
            if (transaction.transactionType === 'sale') {
                monthlyProfit[month] += transaction.amount;
            } else if (transaction.transactionType === 'purchase') {
                monthlyProfit[month] -= transaction.amount;
            }
        });

        res.status(200).json(monthlyProfit);
    } catch (error) {
        console.error("Error calculating monthly profit:", error);
        res.status(500).json({ message: "Server error" });
    }
};
