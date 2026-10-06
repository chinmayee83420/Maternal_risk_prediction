const axios = require('axios');
const { PredictionHistory } = require('../models');

const PYTHON_ML_URL = process.env.PYTHON_ML_URL || 'http://127.0.0.1:8000/predict';

/**
 * Handle prediction requests.
 * Validates inputs, forwards to Python ML Microservice, and records history if user is authenticated.
 * POST /api/predict
 */
async function predictRisk(req, res) {
  try {
    const data = req.body || {};

    const age = parseFloat(data.age);
    const systolic_bp = parseFloat(data.systolic_bp);
    const diastolic_bp = parseFloat(data.diastolic_bp);
    const blood_sugar = parseFloat(data.blood_sugar);
    const body_temp = parseFloat(data.body_temp);
    const heart_rate = parseFloat(data.heart_rate);

    // Validation
    if (isNaN(age) || age <= 0 || age > 120) {
      return res.status(400).json({ success: false, error: 'Please enter a valid age (1-120).' });
    }
    if (isNaN(systolic_bp) || isNaN(diastolic_bp) || systolic_bp <= 0 || diastolic_bp <= 0) {
      return res.status(400).json({ success: false, error: 'Blood pressure values must be greater than 0.' });
    }
    if (isNaN(blood_sugar) || blood_sugar <= 0) {
      return res.status(400).json({ success: false, error: 'Blood sugar must be greater than 0.' });
    }
    if (isNaN(body_temp) || body_temp <= 80 || body_temp > 115) {
      return res.status(400).json({ success: false, error: 'Body temperature must be in °F (85°F - 115°F).' });
    }
    if (isNaN(heart_rate) || heart_rate <= 0 || heart_rate > 250) {
      return res.status(400).json({ success: false, error: 'Please enter a valid heart rate (30-220 bpm).' });
    }

    const payload = {
      age,
      systolic_bp,
      diastolic_bp,
      blood_sugar,
      body_temp,
      heart_rate,
    };

    // Forward request to Python ML Microservice
    let mlResponse;
    try {
      mlResponse = await axios.post(PYTHON_ML_URL, payload, {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (mlErr) {
      console.error('[ML SERVICE ERROR]', mlErr.message);
      return res.status(503).json({
        success: false,
        error: `Python ML Microservice is unreachable (${mlErr.message}). Please ensure Python service is running on port 8000.`,
      });
    }

    const result = mlResponse.data?.data || mlResponse.data;

    // Save prediction history if user is authenticated
    if (req.user && req.user.id) {
      try {
        const historyRecord = await PredictionHistory.create({
          userId: req.user.id,
          age,
          systolic_bp,
          diastolic_bp,
          blood_sugar,
          body_temp,
          heart_rate,
          raw_score: result.raw_score,
          risk_level: result.risk_level,
          recommendation: result.recommendation,
        });
        result.history_id = historyRecord.id;
      } catch (dbErr) {
        console.warn('[DB WARNING] Could not persist prediction to database:', dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[PREDICT CONTROLLER ERROR]', error);
    return res.status(500).json({
      success: false,
      error: `Prediction processing failed: ${error.message}`,
    });
  }
}

module.exports = {
  predictRisk,
};
