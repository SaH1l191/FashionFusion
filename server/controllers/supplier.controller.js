import Supplier from "../models/supplier.model.js";
import Product from "../models/product.model.js";
import Transaction from "../models/transaction.model.js";

// Create a new supplier
export const createSupplier = async (req, res) => {
    try {
        const { name, contactInfo, address } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const newSupplier = new Supplier({
            adminId: req.user._id, 
            name,
            contactInfo,
            address,
        });

        await newSupplier.save();
        res.status(201).json({ message: "Supplier created successfully", supplier: newSupplier });
    } catch (error) {
        console.error("Error creating supplier:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all suppliers
export const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find({ adminId: req.user._id }).populate('productsSupplied');
        
        const suppliersWithTransactions = await Promise.all(suppliers.map(async (supplier) => {
            const totalTransactions = await Transaction.aggregate([
                { $match: { product: { $in: supplier.productsSupplied }, adminId: req.user._id } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);
            
            return {
                ...supplier.toObject(),
                totalTransactions: totalTransactions[0]?.total || 0
            };
        }));

        res.status(200).json(suppliersWithTransactions);
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get a single supplier by ID
export const getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findOne({ _id: req.params.id, adminId: req.user._id }).populate('productsSupplied');
        
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        const totalTransactions = await Transaction.aggregate([
            { $match: { product: { $in: supplier.productsSupplied }, adminId: req.user._id } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const supplierWithTransactions = {
            ...supplier.toObject(),
            totalTransactions: totalTransactions[0]?.total || 0
        };

        res.status(200).json(supplierWithTransactions);
    } catch (error) {
        console.error("Error fetching supplier:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update a supplier by ID
export const updateSupplier = async (req, res) => {
    try {
        const { name, contactInfo, address } = req.body;

        const updatedSupplier = await Supplier.findOneAndUpdate(
            { _id: req.params.id, adminId: req.user._id },
            { name, contactInfo, address },
            { new: true }
        ).populate('productsSupplied');

        if (!updatedSupplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        const totalTransactions = await Transaction.aggregate([
            { $match: { product: { $in: updatedSupplier.productsSupplied }, adminId: req.user._id } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const supplierWithTransactions = {
            ...updatedSupplier.toObject(),
            totalTransactions: totalTransactions[0]?.total || 0
        };

        res.status(200).json({ message: "Supplier updated successfully", supplier: supplierWithTransactions });
    } catch (error) {
        console.error("Error updating supplier:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete a supplier by ID
export const deleteSupplier = async (req, res) => {
    try {
        const deletedSupplier = await Supplier.findOneAndDelete({ _id: req.params.id, adminId: req.user._id });

        if (!deletedSupplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        await Product.updateMany({ supplier: req.params.id }, { $unset: { supplier: "" } });


        res.status(200).json({ message: "Supplier deleted successfully" });
    } catch (error) {
        console.error("Error deleting supplier:", error);
        res.status(500).json({ message: "Server error" });
    }
};
