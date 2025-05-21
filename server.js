const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const app = express();

dotenv.config();

// Import routers
const { authRouter } = require('./routes/auth');
const jobRoutes = require('./routes/jobRoutes');
const adminRoutes = require('./routes/adminRoutes');


// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/jobs", require("./routes/jobRoutes"));

// Optional middleware placeholder (no logging)
app.use((req, res, next) => {
  next();
});


// ✅ API Routes – move ABOVE static middleware
app.use('/api/auth', authRouter);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Serve static files (frontend HTML/CSS/JS)
app.use(express.static(path.join(__dirname, 'public')));

// Default route for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fallback for undefined API routes
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB Connected');
}).catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
