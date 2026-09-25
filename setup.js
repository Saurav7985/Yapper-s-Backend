const fs = require('fs');
const path = require('path');

const dirs = [
  'src/config',
  'src/controllers',
  'src/models',
  'src/routes',
  'src/middleware',
  'src/utils'
];

const files = {
  '.env.example': `PORT=5000\nMONGO_URI=your_mongodb_connection_string\nJWT_SECRET=your_secret_key\nCLIENT_URL=http://localhost:5173\n`,
  'server.js': `require('dotenv').config();\nconst app = require('./src/app');\nconst connectDB = require('./src/config/db');\n\nconst PORT = process.env.PORT || 5000;\n\nconnectDB().then(() => {\n  app.listen(PORT, () => {\n    console.log(\`Server running on port \${PORT}\`);\n  });\n}).catch(err => {\n  console.error('Database connection failed', err);\n  process.exit(1);\n});\n`,
  'src/app.js': `const express = require('express');\nconst cors = require('cors');\nconst helmet = require('helmet');\nconst { errorHandler } = require('./middleware/errorMiddleware');\n\nconst app = express();\n\napp.use(helmet());\napp.use(cors({\n  origin: process.env.CLIENT_URL || 'http://localhost:5173',\n  credentials: true\n}));\napp.use(express.json());\napp.use(require('cookie-parser')());\n\n// Routes\napp.use('/api/auth', require('./routes/authRoutes'));\napp.use('/api/users', require('./routes/userRoutes'));\napp.use('/api/meetups', require('./routes/meetupRoutes'));\napp.use('/api/registrations', require('./routes/registrationRoutes'));\napp.use('/api/moments', require('./routes/momentRoutes'));\napp.use('/api/contact', require('./routes/contactRoutes'));\napp.use('/api/join', require('./routes/joinRoutes'));\napp.use('/api/admin', require('./routes/adminRoutes'));\n\napp.get('/api/health', (req, res) => {\n  res.json({ success: true, message: 'Yappers API is running' });\n});\n\napp.use(errorHandler);\n\nmodule.exports = app;\n`,
  'src/config/db.js': `const mongoose = require('mongoose');\n\nconst connectDB = async () => {\n  try {\n    const conn = await mongoose.connect(process.env.MONGO_URI);\n    console.log(\`MongoDB Connected: \${conn.connection.host}\`);\n  } catch (error) {\n    console.error(\`Error: \${error.message}\`);\n    process.exit(1);\n  }\n};\n\nmodule.exports = connectDB;\n`,
  'src/utils/generateToken.js': `const jwt = require('jsonwebtoken');\n\nconst generateToken = (id) => {\n  return jwt.sign({ id }, process.env.JWT_SECRET, {\n    expiresIn: '30d',\n  });\n};\n\nmodule.exports = generateToken;\n`,
  'src/utils/apiResponse.js': `exports.successResponse = (res, statusCode, message, data = {}) => {\n  return res.status(statusCode).json({\n    success: true,\n    message,\n    data\n  });\n};\n\nexports.errorResponse = (res, statusCode, message, error = {}) => {\n  return res.status(statusCode).json({\n    success: false,\n    message,\n    error\n  });\n};\n`,
  'src/middleware/errorMiddleware.js': `exports.errorHandler = (err, req, res, next) => {\n  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;\n  let message = err.message;\n\n  if (err.name === 'CastError' && err.kind === 'ObjectId') {\n    statusCode = 404;\n    message = 'Resource not found';\n  }\n\n  res.status(statusCode).json({\n    success: false,\n    message,\n    stack: process.env.NODE_ENV === 'production' ? null : err.stack,\n  });\n};\n`,
  'src/middleware/authMiddleware.js': `const jwt = require('jsonwebtoken');\nconst User = require('../models/User');\n\nexports.protect = async (req, res, next) => {\n  let token;\n  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {\n    try {\n      token = req.headers.authorization.split(' ')[1];\n      const decoded = jwt.verify(token, process.env.JWT_SECRET);\n      req.user = await User.findById(decoded.id).select('-password');\n      next();\n    } catch (error) {\n      res.status(401);\n      throw new Error('Not authorized, token failed');\n    }\n  }\n  if (!token) {\n    res.status(401);\n    throw new Error('Not authorized, no token');\n  }\n};\n`,
  'src/middleware/adminMiddleware.js': `exports.admin = (req, res, next) => {\n  if (req.user && req.user.role === 'admin') {\n    next();\n  } else {\n    res.status(403);\n    throw new Error('Not authorized as an admin');\n  }\n};\n`,
  'src/models/User.js': `const mongoose = require('mongoose');\nconst bcrypt = require('bcrypt');\n\nconst userSchema = mongoose.Schema({\n  name: { type: String, required: true },\n  email: { type: String, required: true, unique: true },\n  phone: { type: String },\n  password: { type: String, required: true },\n  role: { type: String, enum: ['user', 'admin'], default: 'user' },\n  instagramUsername: { type: String },\n  isActive: { type: Boolean, default: true },\n}, { timestamps: true });\n\nuserSchema.pre('save', async function (next) {\n  if (!this.isModified('password')) return next();\n  const salt = await bcrypt.genSalt(10);\n  this.password = await bcrypt.hash(this.password, salt);\n});\n\nuserSchema.methods.matchPassword = async function (enteredPassword) {\n  return await bcrypt.compare(enteredPassword, this.password);\n};\n\nmodule.exports = mongoose.model('User', userSchema);\n`,
  'src/models/Meetup.js': `const mongoose = require('mongoose');\n\nconst meetupSchema = mongoose.Schema({\n  title: { type: String, required: true },\n  description: { type: String, required: true },\n  category: { type: String },\n  image: { type: String },\n  date: { type: String, required: true },\n  startTime: { type: String, required: true },\n  endTime: { type: String },\n  location: { type: String },\n  address: { type: String },\n  capacity: { type: Number, required: true },\n  registeredCount: { type: Number, default: 0, min: 0 },\n  status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming' },\n  isFeatured: { type: Boolean, default: false },\n}, { timestamps: true });\n\nmeetupSchema.index({ date: 1 });\nmeetupSchema.index({ status: 1 });\n\nmodule.exports = mongoose.model('Meetup', meetupSchema);\n`,
  'src/models/Registration.js': `const mongoose = require('mongoose');\n\nconst registrationSchema = mongoose.Schema({\n  meetup: { type: mongoose.Schema.Types.ObjectId, ref: 'Meetup', required: true },\n  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },\n  name: { type: String, required: true },\n  phone: { type: String, required: true },\n  email: { type: String, required: true },\n  status: { type: String, enum: ['registered', 'cancelled', 'attended'], default: 'registered' },\n}, { timestamps: true });\n\nregistrationSchema.index({ user: 1, meetup: 1 }, { unique: true });\n\nmodule.exports = mongoose.model('Registration', registrationSchema);\n`,
  'src/models/Moment.js': `const mongoose = require('mongoose');\n\nconst momentSchema = mongoose.Schema({\n  image: { type: String, required: true },\n  title: { type: String, required: true },\n  category: { type: String },\n  description: { type: String },\n  isPublished: { type: Boolean, default: false },\n}, { timestamps: true });\n\nmomentSchema.index({ isPublished: 1 });\n\nmodule.exports = mongoose.model('Moment', momentSchema);\n`,
  'src/models/Contact.js': `const mongoose = require('mongoose');\n\nconst contactSchema = mongoose.Schema({\n  name: { type: String, required: true },\n  email: { type: String, required: true },\n  phone: { type: String },\n  message: { type: String, required: true },\n  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },\n}, { timestamps: true });\n\nmodule.exports = mongoose.model('Contact', contactSchema);\n`,
  'src/models/JoinRequest.js': `const mongoose = require('mongoose');\n\nconst joinRequestSchema = mongoose.Schema({\n  name: { type: String, required: true },\n  phone: { type: String, required: true },\n  reason: { type: String, required: true },\n  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },\n}, { timestamps: true });\n\nmodule.exports = mongoose.model('JoinRequest', joinRequestSchema);\n`,
  
  // Basic controllers structure
  'src/controllers/authController.js': `const User = require('../models/User');\nconst generateToken = require('../utils/generateToken');\nconst { successResponse, errorResponse } = require('../utils/apiResponse');\n\nexports.registerUser = async (req, res, next) => { /* TODO */ };\nexports.loginUser = async (req, res, next) => { /* TODO */ };\nexports.getMe = async (req, res, next) => { /* TODO */ };\n`,
  'src/controllers/userController.js': `exports.getUsers = async (req, res, next) => { /* TODO */ };\n`,
  'src/controllers/meetupController.js': `exports.getMeetups = async (req, res, next) => { /* TODO */ };\n`,
  'src/controllers/registrationController.js': `exports.createRegistration = async (req, res, next) => { /* TODO */ };\n`,
  'src/controllers/momentController.js': `exports.getMoments = async (req, res, next) => { /* TODO */ };\n`,
  'src/controllers/contactController.js': `exports.createContact = async (req, res, next) => { /* TODO */ };\n`,
  'src/controllers/joinController.js': `exports.createJoinRequest = async (req, res, next) => { /* TODO */ };\n`,
  'src/controllers/adminController.js': `exports.getDashboard = async (req, res, next) => { /* TODO */ };\n`,

  // Basic routes structure
  'src/routes/authRoutes.js': `const express = require('express');\nconst router = express.Router();\nconst { registerUser, loginUser, getMe } = require('../controllers/authController');\nconst { protect } = require('../middleware/authMiddleware');\n\nrouter.post('/register', registerUser);\nrouter.post('/login', loginUser);\nrouter.get('/me', protect, getMe);\n\nmodule.exports = router;\n`,
  'src/routes/userRoutes.js': `const express = require('express');\nconst router = express.Router();\nmodule.exports = router;\n`,
  'src/routes/meetupRoutes.js': `const express = require('express');\nconst router = express.Router();\nmodule.exports = router;\n`,
  'src/routes/registrationRoutes.js': `const express = require('express');\nconst router = express.Router();\nmodule.exports = router;\n`,
  'src/routes/momentRoutes.js': `const express = require('express');\nconst router = express.Router();\nmodule.exports = router;\n`,
  'src/routes/contactRoutes.js': `const express = require('express');\nconst router = express.Router();\nmodule.exports = router;\n`,
  'src/routes/joinRoutes.js': `const express = require('express');\nconst router = express.Router();\nmodule.exports = router;\n`,
  'src/routes/adminRoutes.js': `const express = require('express');\nconst router = express.Router();\nmodule.exports = router;\n`
};

dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(__dirname, filepath), content);
}

console.log('Backend boilerplate generated.');
