const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const taskRoutes = require('./routes/tasks');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Atlas Connected Successfully'))
.catch(err => {
    console.error('MongoDB Connection Error:', err);
    console.log('\n--- Database Connection Warning ---');
    console.log('If you are seeing this error, please ensure you have added a valid MONGO_URI in your .env file.');
    console.log('You can find instructions on how to get this URI in the MongoDB Atlas dashboard.');
    console.log('-----------------------------------\n');
});

// API Routes
app.use('/api/tasks', taskRoutes);

// Serve static frontend in production
app.use(express.static(path.join(__dirname, 'client/dist')));

// Handle React routing (Catch-all)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access the application at http://localhost:${PORT}`);
});
