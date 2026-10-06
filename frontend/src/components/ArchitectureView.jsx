import React from 'react';
import { Database, Server, Layout, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

export default function ArchitectureView() {
  return (
    <div className="card architecture-card">
      <h2>Microservices System Architecture</h2>
      <p className="card-subtitle">
        React Frontend + Node.js/Express Auth & Gateway + Python/Keras ML Engine + PostgreSQL
      </p>

      <div className="arch-grid">
        {/* Frontend Box */}
        <div className="arch-box">
          <div className="arch-box-header">
            <Layout className="arch-icon blue" size={24} />
            <div>
              <h3>Frontend (React + Vite)</h3>
              <span className="arch-tech">Folder: /frontend &bull; Port 5173</span>
            </div>
          </div>
          <ul className="arch-list">
            <li>Modern responsive UI built with Vite and React 18.</li>
            <li>Async API client with automatic JWT token management in <code>localStorage</code>.</li>
            <li>Real-time vitals validation, risk gauge visualization, and presets.</li>
            <li>Unified communication with Express API Gateway via Vite proxy.</li>
          </ul>
        </div>

        {/* Express Auth & Gateway Box */}
        <div className="arch-box">
          <div className="arch-box-header">
            <ShieldCheck className="arch-icon green" size={24} />
            <div>
              <h3>Auth & Gateway (Express.js)</h3>
              <span className="arch-tech">Folder: /express-backend &bull; Port 5000</span>
            </div>
          </div>
          <ul className="arch-list">
            <li><strong>User Authentication:</strong> Secure Register, Login & JWT verification (<code>bcryptjs</code> + <code>jsonwebtoken</code>).</li>
            <li><strong>Database Management:</strong> Sequelize ORM connecting to PostgreSQL (<code>users</code> & <code>prediction_history</code>).</li>
            <li><strong>Prediction Gateway:</strong> Receives prediction requests, forwards to Python ML service, and records history for logged-in users.</li>
          </ul>
        </div>

        {/* Python ML Service Box */}
        <div className="arch-box">
          <div className="arch-box-header">
            <Cpu className="arch-icon orange" size={24} />
            <div>
              <h3>ML Service (Python & Flask)</h3>
              <span className="arch-tech">Folder: /python-backend &bull; Port 8000</span>
            </div>
          </div>
          <ul className="arch-list">
            <li><strong>Neural Network:</strong> Deep learning model loaded via <code>my_model.keras</code>.</li>
            <li><strong>Feature Preprocessing:</strong> <code>StandardScaler</code> normalization on the 6 clinical vitals.</li>
            <li><strong>Inference API:</strong> High-speed prediction microservice providing risk scores and medical guidance.</li>
          </ul>
        </div>

        {/* Database Box */}
        <div className="arch-box">
          <div className="arch-box-header">
            <Database className="arch-icon purple" size={24} />
            <div>
              <h3>Database (PostgreSQL)</h3>
              <span className="arch-tech">Sequelize ORM Integration</span>
            </div>
          </div>
          <ul className="arch-list">
            <li><code>users</code> table: Unique username & email index with salted hashed passwords.</li>
            <li><code>prediction_history</code> table: Relational foreign key linked to user accounts.</li>
            <li>Auto-synchronization on backend startup via <code>sequelize.sync()</code>.</li>
          </ul>
        </div>
      </div>

      {/* Microservice Flow Diagram */}
      <div className="postgres-guide" style={{ marginTop: '24px' }}>
        <h4>Microservice Request Flow</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', padding: '12px 0', fontSize: '0.9rem', color: '#cbd5e1' }}>
          <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>React UI (5173)</span>
          <ArrowRight size={16} />
          <span style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>Express Gateway (5000)</span>
          <ArrowRight size={16} />
          <span style={{ background: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>Python ML (8000)</span>
          <ArrowRight size={16} />
          <span style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>PostgreSQL</span>
        </div>
      </div>

      {/* Quick Run Guide */}
      <div className="postgres-guide" style={{ marginTop: '16px' }}>
        <h4>How to Run the Services</h4>
        <ol className="guide-steps">
          <li><strong>Python ML Service:</strong> <code>cd python-backend && python app.py</code> (Port 8000)</li>
          <li><strong>Express Backend:</strong> <code>cd express-backend && npm run dev</code> (Port 5000)</li>
          <li><strong>React Frontend:</strong> <code>cd frontend && npm run dev</code> (Port 5173)</li>
        </ol>
      </div>
    </div>
  );
}
