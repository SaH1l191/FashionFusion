import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/user.model.js';
import Product from './models/product.model.js';
import Supplier from './models/supplier.model.js';
import Transaction from './models/transaction.model.js';
import dotenv from "dotenv"; 

export const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Supplier.deleteMany({});
    await Transaction.deleteMany({});

    // Create a single user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: hashedPassword,
    });

    // Create default 'Self' supplier
    const selfSupplier = await Supplier.create({
      adminId: user._id,
      name: 'Self',
      contactInfo: 'N/A',
      address: 'N/A',
    });

    // Create other suppliers
    const suppliers = [selfSupplier];
    for (let i = 1; i <= 49; i++) {
      const supplier = await Supplier.create({
        adminId: user._id,
        name: `Supplier ${i}`,
        contactInfo: `contact@supplier${i}.com`,
        address: `${i * 100} Supplier Street, City ${i}, State ${i}`,
      });
      suppliers.push(supplier);
    }

    // Update categories for clothing shop
    const categories = ['Shirts', 'Pants', 'Dresses', 'Shoes', 'Accessories'];

    // Create products
    const products = [];
    const clothingItems = ['T-Shirt', 'Jeans', 'Dress', 'Sneakers', 'Belt', 'Jacket', 'Skirt', 'Sweater'];
    for (let i = 1; i <= 50; i++) {
      const product = await Product.create({
        adminId: user._id,
        name: `${clothingItems[Math.floor(Math.random() * clothingItems.length)]} ${i}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        price: parseFloat((Math.random() * 150 + 10).toFixed(2)), // Adjusted price range
        stockQuantity: Math.floor(Math.random() * 100) + 10, // Ensure minimum stock of 10
        supplier: suppliers[Math.floor(Math.random() * suppliers.length)]._id,
      });
      products.push(product);
    }

    // Update suppliers with products
    for (const supplier of suppliers) {
      const suppliedProducts = products
        .filter(() => Math.random() < 0.2)
        .map(product => product._id);
      await Supplier.updateOne(
        { _id: supplier._id },
        { $set: { productsSupplied: suppliedProducts } }
      );
    }

    // Create transactions
    const transactionTypes = ['purchase', 'sale'];
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    for (let i = 1; i <= 100; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const transactionType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      let quantity = Math.floor(Math.random() * 10) + 1; // Reduced max quantity per transaction
      const transactionDate = new Date(sixMonthsAgo.getTime() + Math.random() * (Date.now() - sixMonthsAgo.getTime()));
      
      // Fetch the current stock quantity
      const currentStock = await Product.findById(product._id).select('stockQuantity');
      
      if (transactionType === 'sale') {
        // Ensure we don't sell more than we have in stock
        quantity = Math.min(quantity, currentStock.stockQuantity);
        if (quantity === 0) continue; // Skip this iteration if no stock available
      }

      await Transaction.create({
        adminId: user._id,
        product: product._id,
        quantity: quantity,
        transactionType: transactionType,
        amount: quantity * product.price,
        supplier: transactionType === 'purchase' ? product.supplier : undefined,
        date: transactionDate
      });

      // Update product stock quantity
      const stockChange = transactionType === 'purchase' ? quantity : -quantity;
      await Product.updateOne(
        { _id: product._id },
        { $inc: { stockQuantity: stockChange } }
      );
    }

    console.log('Data seeding completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
  }
};

seedData();