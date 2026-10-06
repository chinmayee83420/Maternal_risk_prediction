import React, { useState } from 'react';
import { Sparkles, RotateCcw, Send, AlertTriangle } from 'lucide-react';
import { predictRisk } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PredictForm({ onPredictionResult }) {
  const { isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    age: '',
    systolic_bp: '',
    diastolic_bp: '',
    blood_sugar: '',
    body_temp: '',
    heart_rate: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // Sample Presets
  const applyPreset = (type) => {
    setError('');
    if (type === 'low') {
      setFormData({
        age: 35,
        systolic_bp: 120,
        diastolic_bp: 60,
        blood_sugar: 6.1,
        body_temp: 98.0,
        heart_rate: 76
      });
    } else if (type === 'mid') {
      setFormData({
        age: 32,
        systolic_bp: 120,
        diastolic_bp: 65,
        blood_sugar: 6.0,
        body_temp: 101.0,
        heart_rate: 76
      });
    } else if (type === 'high') {
      setFormData({
        age: 25,
        systolic_bp: 130,
        diastolic_bp: 80,
        blood_sugar: 15.0,
        body_temp: 98.0,
        heart_rate: 86
      });
    }
  };

  const handleClear = () => {
    setFormData({
      age: '',
      systolic_bp: '',
      diastolic_bp: '',
      blood_sugar: '',
      body_temp: '',
      heart_rate: ''
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Convert inputs to numbers
    const payload = {
      age: parseFloat(formData.age),
      systolic_bp: parseFloat(formData.systolic_bp),
      diastolic_bp: parseFloat(formData.diastolic_bp),
      blood_sugar: parseFloat(formData.blood_sugar),
      body_temp: parseFloat(formData.body_temp),
      heart_rate: parseFloat(formData.heart_rate)
    };

    setLoading(true);
    try {
      const res = await predictRisk(payload);
      if (res.success && res.data) {
        onPredictionResult(res.data);
      } else {
        setError(res.error || 'Failed to compute prediction. Please check inputs.');
      }
    } catch (err) {
      setError('Could not connect to Flask backend. Make sure the server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card predict-card">
      <div className="card-header">
        <div>
          <h2>Patient Health Parameters</h2>
          <p className="card-subtitle">
            Enter maternal clinical vitals to run evaluation through the neural network.
          </p>
        </div>

        {/* Quick presets */}
        <div className="presets-bar">
          <span className="preset-label">Test Presets:</span>
          <button
            type="button"
            className="btn-preset low"
            onClick={() => applyPreset('low')}
          >
            <Sparkles size={14} /> Low Risk
          </button>
          <button
            type="button"
            className="btn-preset mid"
            onClick={() => applyPreset('mid')}
          >
            <Sparkles size={14} /> Mid Risk
          </button>
          <button
            type="button"
            className="btn-preset high"
            onClick={() => applyPreset('high')}
          >
            <Sparkles size={14} /> High Risk
          </button>
          <button
            type="button"
            className="btn-preset clear"
            onClick={handleClear}
            title="Reset form"
          >
            <RotateCcw size={14} /> Clear
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {!isAuthenticated && (
        <div className="alert alert-info">
          <span>💡 You are evaluating as a <strong>Guest</strong>. <button type="button" className="link-inline" onClick={() => applyPreset('low')}>Log in</button> to automatically record predictions to your PostgreSQL database.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="vitals-form">
        <div className="form-grid">
          {/* Age */}
          <div className="form-group">
            <label htmlFor="age">Age (years)</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 25"
              min="10"
              max="100"
              step="1"
              required
            />
            <span className="field-hint">Range: 15 – 50 years</span>
          </div>

          {/* Systolic BP */}
          <div className="form-group">
            <label htmlFor="systolic_bp">Systolic BP (mmHg)</label>
            <input
              type="number"
              id="systolic_bp"
              name="systolic_bp"
              value={formData.systolic_bp}
              onChange={handleChange}
              placeholder="e.g. 120"
              min="50"
              max="220"
              step="1"
              required
            />
            <span className="field-hint">Normal: 90 – 120 mmHg</span>
          </div>

          {/* Diastolic BP */}
          <div className="form-group">
            <label htmlFor="diastolic_bp">Diastolic BP (mmHg)</label>
            <input
              type="number"
              id="diastolic_bp"
              name="diastolic_bp"
              value={formData.diastolic_bp}
              onChange={handleChange}
              placeholder="e.g. 80"
              min="30"
              max="140"
              step="1"
              required
            />
            <span className="field-hint">Normal: 60 – 80 mmHg</span>
          </div>

          {/* Blood Sugar */}
          <div className="form-group">
            <label htmlFor="blood_sugar">Blood Sugar (mmol/L)</label>
            <input
              type="number"
              id="blood_sugar"
              name="blood_sugar"
              value={formData.blood_sugar}
              onChange={handleChange}
              placeholder="e.g. 6.5"
              min="1"
              max="30"
              step="0.1"
              required
            />
            <span className="field-hint">Normal: 4.0 – 7.8 mmol/L</span>
          </div>

          {/* Body Temperature */}
          <div className="form-group">
            <label htmlFor="body_temp">Body Temperature (°F)</label>
            <input
              type="number"
              id="body_temp"
              name="body_temp"
              value={formData.body_temp}
              onChange={handleChange}
              placeholder="e.g. 98.6"
              min="85"
              max="115"
              step="0.1"
              required
            />
            <span className="field-hint">Normal: 97.0 – 99.0 °F</span>
          </div>

          {/* Heart Rate */}
          <div className="form-group">
            <label htmlFor="heart_rate">Heart Rate (bpm)</label>
            <input
              type="number"
              id="heart_rate"
              name="heart_rate"
              value={formData.heart_rate}
              onChange={handleChange}
              placeholder="e.g. 76"
              min="40"
              max="220"
              step="1"
              required
            />
            <span className="field-hint">Normal: 60 – 100 bpm</span>
          </div>
        </div>

        <div className="form-footer">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner"></span> Analyzing Vitals...
              </span>
            ) : (
              <>
                <Send size={18} />
                <span>Evaluate Risk Level</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
