const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const apiRoutes = require('./routes/api');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Database Connection (FIXED)
if (!process.env.MONGO_URI) {
  console.error("Missing MONGO_URI in .env file.");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🔥 MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// API Routes
app.use('/api', apiRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, 'client/dist')));

// ✅ FIXED catch-all route (IMPORTANT)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
