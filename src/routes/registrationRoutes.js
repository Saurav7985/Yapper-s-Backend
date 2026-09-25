const express = require('express');
const router = express.Router();
const { createRegistration } = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');
router.post('/', protect, createRegistration);
module.exports = router;
