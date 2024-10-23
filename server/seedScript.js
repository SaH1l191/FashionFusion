import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/user.model.js';
import Product from './models/product.model.js';
import Supplier from './models/supplier.model.js';
import Transaction from './models/transaction.model.js';
import dotenv from "dotenv"; 
dotenv.config();
// Define startDate at the top level
const startDate = new Date();
startDate.setFullYear(startDate.getFullYear() - 1);
const endDate = new Date();

const generateBaselineDemand = (baseAmount, day) => {
    // Weekly pattern - higher demand on weekends
    const dayOfWeek = day.getDay();
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.5 : 1.0;
    
    // Monthly pattern - higher demand at start/end of month
    const dayOfMonth = day.getDate();
    const monthMultiplier = (dayOfMonth <= 5 || dayOfMonth >= 25) ? 1.2 : 1.0;
    
    // Seasonal pattern - higher in summer and winter (shopping seasons)
    const month = day.getMonth();
    const seasonalMultiplier = Math.sin((month + 1) * Math.PI / 6) * 0.3 + 1.2;
    
    // Gradual upward trend over time
    const daysSinceStart = Math.floor((day - startDate) / (1000 * 60 * 60 * 24));
    const trendMultiplier = 1 + (daysSinceStart * 0.0005); // Small daily increase
    
    return Math.round(baseAmount * weekendMultiplier * monthMultiplier * seasonalMultiplier * trendMultiplier);
};

const addNoise = (baseValue) => {
    // Add small random variations (±10%)
    const noise = (Math.random() - 0.5) * 0.2;
    return Math.max(1, Math.round(baseValue * (1 + noise)));
};

export const seedData2 = async () => {
    try {
        await mongoose.connect("mongodb+srv://asphaltking30:RJaC3Cb9EwPLEG3f@cluster0.fznv9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        await Supplier.deleteMany({});
        await Transaction.deleteMany({});

        // Create user
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = await User.create({
            name: 'John Doe',
            username: 'johndoe',
            email: 'john@example.com',
            password: hashedPassword,
        });

        // Create suppliers (simplified)
        const selfSupplier = await Supplier.create({
            adminId: user._id,
            name: 'Self',
            contactInfo: 'N/A',
            address: 'N/A',
        });

        // Create fewer products for more focused data
        const categories = ['Shirts', 'Pants', 'Dresses'];
        const products = [];
        const baselinePrices = {
            'Shirts': 29.99,
            'Pants': 49.99,
            'Dresses': 79.99,
        };

        // Create one popular product per category
        for (const category of categories) {
            const product = await Product.create({
                adminId: user._id,
                name: `Popular ${category}`,
                category: category,
                price: baselinePrices[category],
                stockQuantity: 1000,
                supplier: selfSupplier._id,
            });
            products.push(product);
        }

        // Generate transactions for each product
        for (const product of products) {
            let currentDate = new Date(startDate);
            
            while (currentDate <= endDate) {
                // Generate base demand for this product/day
                const baselineDemand = generateBaselineDemand(
                    product.category === 'Shirts' ? 15 :
                    product.category === 'Pants' ? 10 : 8,
                    currentDate
                );
                
                // Add some noise to make it more realistic
                const actualDemand = addNoise(baselineDemand);
                
                // Create sale transaction
                if (actualDemand > 0) {
                    await Transaction.create({
                        adminId: user._id,
                        product: product._id,
                        quantity: actualDemand,
                        transactionType: 'sale',
                        amount: actualDemand * product.price,
                        date: new Date(currentDate)
                    });

                    // Create purchase transaction every 7 days to restock
                    if (currentDate.getDay() === 1) { // Monday restocking
                        const restockAmount = Math.ceil(actualDemand * 1.2); // 20% buffer
                        await Transaction.create({
                            adminId: user._id,
                            product: product._id,
                            quantity: restockAmount,
                            transactionType: 'purchase',
                            amount: restockAmount * product.price * 0.6, // 40% margin
                            supplier: selfSupplier._id,
                            date: new Date(currentDate)
                        });
                    }
                }

                // Move to next day
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        console.log('Data seeding completed successfully');
        
        // Log summary statistics
        const totalTransactions = await Transaction.countDocuments();
        const salesTransactions = await Transaction.countDocuments({ transactionType: 'sale' });
        const purchaseTransactions = await Transaction.countDocuments({ transactionType: 'purchase' });
        
        console.log('\nData Generation Summary:');
        console.log(`Total Transactions: ${totalTransactions}`);
        console.log(`Sales Transactions: ${salesTransactions}`);
        console.log(`Purchase Transactions: ${purchaseTransactions}`);
        console.log(`Date Range: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`);

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await mongoose.connection.close();
    }
};

seedData2();