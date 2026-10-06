import React, { useState, useEffect } from 'react';
import { getPredictionHistory, deleteHistoryRecord } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Trash2, Calendar, Activity, Database, AlertCircle, RefreshCw } from 'lucide-react';

export default function HistoryView() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getPredictionHistory();
      if (res.success) {
        setHistory(res.history || []);
      } else {
        setError(res.error || 'Failed to load history.');
      }
    } catch (err) {
      setError('Could not connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assessment record?')) return;

    try {
      const res = await deleteHistoryRecord(id);
      if (res.success) {
        setHistory(history.filter((item) => item.id !== id));
      } else {
        alert(res.error || 'Failed to delete record.');
      }
    } catch (err) {
      alert('Network error while deleting record.');
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Just now';
    const d = new Date(isoString);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="card history-card">
      <div className="card-header history-header">
        <div>
          <h2>Assessment History</h2>
          <p className="card-subtitle">
            Saved patient assessments for <strong>{user?.username}</strong> stored in PostgreSQL.
          </p>
        </div>

        <button className="btn-refresh" onClick={fetchHistory} title="Refresh Records">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading database records...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="empty-state">
          <Database size={48} className="empty-icon" />
          <h3>No Assessments Found</h3>
          <p>When you evaluate maternal vitals while logged in, records will automatically be saved to PostgreSQL here.</p>
        </div>
      ) : (
        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Risk Level</th>
                <th>Age</th>
                <th>Blood Pressure</th>
                <th>Blood Sugar</th>
                <th>Body Temp</th>
                <th>Heart Rate</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => {
                const badgeClass =
                  record.risk_level.toLowerCase().includes('high')
                    ? 'high-risk'
                    : record.risk_level.toLowerCase().includes('mid')
                    ? 'mid-risk'
                    : 'low-risk';

                return (
                  <tr key={record.id}>
                    <td className="date-cell">
                      <Calendar size={14} className="cell-icon" />
                      <span>{formatDate(record.created_at)}</span>
                    </td>
                    <td>
                      <span className={`table-badge ${badgeClass}`}>
                        {record.risk_level}
                      </span>
                    </td>
                    <td>{record.inputs.age} yrs</td>
                    <td>{record.inputs.systolic_bp} / {record.inputs.diastolic_bp}</td>
                    <td>{record.inputs.blood_sugar}</td>
                    <td>{record.inputs.body_temp} °F</td>
                    <td>{record.inputs.heart_rate} bpm</td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(record.id)}
                        title="Delete Record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
