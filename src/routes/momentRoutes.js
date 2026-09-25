const express = require('express');
const router = express.Router();
const { getMoments } = require('../controllers/momentController');
router.get('/', getMoments);
module.exports = router;
