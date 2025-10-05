require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();
connectDB();

// ✅ CORS: Allow localhost for now (dev mode)
app.use(cors({
  origin: 'http://localhost:3000,https://blogsite-qoyx-saksham.vercel.app,https://blogsite-u93c.vercel.app/', // 👈 Only allow React dev server
  credentials: true
}));

// ✅ Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

// ✅ Test Route (Optional)
app.get('/', (req, res) => {
  res.json({ message: '🚀 Backend running with CORS configured for localhost!' });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);
  res.status(500).json({ message: err.message });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
