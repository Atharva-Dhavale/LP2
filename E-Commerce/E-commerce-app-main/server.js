require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
if (!process.env.MONGO_URI) {
    console.error('ERROR: MONGO_URI is not defined. Please create a .env file with your MongoDB Atlas connection string.');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB Atlas.');
    await seedDatabase();
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB Atlas:', err.message);
    process.exit(1);
  });

// Mongoose Models
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image: { type: String, required: true }
});

const purchaseSchema = new mongoose.Schema({
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        price: Number
    }],
    totalAmount: Number,
    purchaseDate: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
const Purchase = mongoose.model('Purchase', purchaseSchema);

// Seed Database Function
async function seedDatabase() {
    try {
        const count = await Product.countDocuments();
        if (count === 0) {
            const sampleProducts = [
                { name: 'Premium Wireless Headphones', description: 'Noise-cancelling, over-ear headphones with 30-hour battery life.', price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
                { name: 'Smart Fitness Watch', description: 'Track your health, sleep, and workouts. Water-resistant.', price: 199.50, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
                { name: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard with tactile switches.', price: 149.00, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80' },
                { name: '4K Action Camera', description: 'Ultra HD action camera for sports and adventures.', price: 249.99, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80' },
                { name: 'Portable Bluetooth Speaker', description: '360-degree sound, waterproof design, 12-hour playtime.', price: 89.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80' },
                { name: 'Minimalist Backpack', description: 'Water-resistant urban backpack with laptop sleeve.', price: 75.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80' }
            ];
            await Product.insertMany(sampleProducts);
            console.log('Database seeded with sample products.');
        }
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

// API Routes
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ data: products });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/checkout', async (req, res) => {
    const { items, totalAmount } = req.body;
    
    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    try {
        const purchase = new Purchase({ items, totalAmount });
        await purchase.save();
        res.json({ 
            success: true, 
            message: 'Checkout successful!', 
            purchaseId: purchase._id 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Purchase.find({})
            .populate('items.productId', 'name image price')
            .sort({ purchaseDate: -1 });
        res.json({ data: orders });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve static React files
app.use(express.static(path.join(__dirname, 'client/dist')));

// Catch-all to send index.html for React Router (if used in future)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access the app at: http://localhost:${PORT}`);
});
