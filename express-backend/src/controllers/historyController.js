const { PredictionHistory } = require('../models');

/**
 * Get prediction history for the authenticated user.
 * GET /api/history
 */
async function getHistory(req, res) {
  try {
    const records = await PredictionHistory.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      history: records.map((record) => record.toFormattedJSON()),
    });
  } catch (error) {
    console.error('[HISTORY ERROR]', error);
    return res.status(500).json({
      success: false,
      error: `Could not retrieve prediction history: ${error.message}`,
    });
  }
}

/**
 * Delete a specific prediction record belonging to the authenticated user.
 * DELETE /api/history/:id
 */
async function deleteHistoryRecord(req, res) {
  try {
    const recordId = parseInt(req.params.id, 10);
    if (isNaN(recordId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid history record ID.',
      });
    }

    const record = await PredictionHistory.findOne({
      where: {
        id: recordId,
        userId: req.user.id,
      },
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'History record not found or does not belong to you.',
      });
    }

    await record.destroy();

    return res.status(200).json({
      success: true,
      message: 'Record deleted successfully.',
    });
  } catch (error) {
    console.error('[DELETE HISTORY ERROR]', error);
    return res.status(500).json({
      success: false,
      error: `Failed to delete record: ${error.message}`,
    });
  }
}

module.exports = {
  getHistory,
  deleteHistoryRecord,
};
