const express = require('express');
const router = express.Router();
const { predictRisk } = require('../controllers/predictController');
const { optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, predictRisk);

module.exports = router;
