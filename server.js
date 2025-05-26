// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

dotenv.config();

const app = express();

// 🔧 Middleware
app.use(express.json());  // Parse JSON request bodies
app.use(cors());          // Enable Cross-Origin Resource Sharing
// 📦 Routes


const authRouter = require('./routes/auth');
const jobRoutes = require('./routes/jobRoutes');
const adminRoutes = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const feedbackRoutes = require('./routes/feedback');

app.use('/api/auth', authRouter);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/feedback', feedbackRoutes);

// 🌐 Static File Serving
app.use(express.static(path.join(__dirname, 'public')));

// SPA Fallback
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle undefined API routes
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// 🔌 MongoDB Connection

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err.message));

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
