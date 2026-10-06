import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Database, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ResultCard({ result }) {
  const { isAuthenticated } = useAuth();

  if (!result) return null;

  const { risk_level, risk_class, raw_score, recommendation, inputs, history_id } = result;

  const getRiskIcon = () => {
    switch (risk_class) {
      case 'low-risk':
        return <CheckCircle2 className="risk-icon low" size={32} />;
      case 'mid-risk':
        return <AlertTriangle className="risk-icon mid" size={32} />;
      case 'high-risk':
      default:
        return <AlertOctagon className="risk-icon high" size={32} />;
    }
  };

  return (
    <div className={`card result-card ${risk_class}`}>
      <div className="result-header">
        <div className="result-title-group">
          {getRiskIcon()}
          <div>
            <span className="result-tag">Assessment Result</span>
            <h2 className="risk-title">{risk_level}</h2>
          </div>
        </div>

        <div className="result-score-badge">
          <span className="score-label">Model Probability</span>
          <span className="score-value">{(raw_score * 100).toFixed(1)}%</span>
        </div>
      </div>

      {/* Recommendation box */}
      <div className="recommendation-box">
        <h4>Clinical Guidance & Recommendation</h4>
        <p>{recommendation}</p>
      </div>

      {/* Inputs Summary Table */}
      {inputs && (
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Age</span>
            <span className="summary-val">{inputs.age} yrs</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Blood Pressure</span>
            <span className="summary-val">{inputs.systolic_bp} / {inputs.diastolic_bp}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Blood Sugar</span>
            <span className="summary-val">{inputs.blood_sugar} mmol/L</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Body Temp</span>
            <span className="summary-val">{inputs.body_temp} °F</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Heart Rate</span>
            <span className="summary-val">{inputs.heart_rate} bpm</span>
          </div>
        </div>
      )}

      {/* PostgreSQL History feedback */}
      <div className="db-save-status">
        {history_id ? (
          <span className="db-saved">
            <Database size={15} />
            <span>Successfully recorded to your PostgreSQL history (Record #{history_id})</span>
          </span>
        ) : (
          <span className="db-guest">
            <Database size={15} />
            <span>Evaluated as Guest &bull; Sign in to preserve assessments in your database</span>
          </span>
        )}
      </div>
    </div>
  );
}
