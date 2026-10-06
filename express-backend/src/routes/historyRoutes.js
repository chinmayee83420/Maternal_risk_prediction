const express = require('express');
const router = express.Router();
const { getHistory, deleteHistoryRecord } = require('../controllers/historyController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getHistory);
router.delete('/:id', authenticateToken, deleteHistoryRecord);

module.exports = router;
