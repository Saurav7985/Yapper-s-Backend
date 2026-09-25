const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://yapper-s.vercel.app',
  credentials: true
}));
app.use(express.json());
app.use(require('cookie-parser')());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/meetups', require('./routes/meetupRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use('/api/moments', require('./routes/momentRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/join', require('./routes/joinRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Yappers API is running' });
});

app.use(errorHandler);

module.exports = app;
