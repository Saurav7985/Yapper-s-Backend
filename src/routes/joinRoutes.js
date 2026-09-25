const express = require('express');
const router = express.Router();
const { createJoinRequest } = require('../controllers/joinController');
router.post('/', createJoinRequest);
module.exports = router;
