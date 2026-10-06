import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import PredictForm from './components/PredictForm';
import ResultCard from './components/ResultCard';
import HistoryView from './components/HistoryView';
import ArchitectureView from './components/ArchitectureView';
import './App.css';

function MainContent() {
  const [activeTab, setActiveTab] = useState('predict'); // 'predict', 'history', 'about'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [lastPrediction, setLastPrediction] = useState(null);

  const { isAuthenticated } = useAuth();

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handlePredictionResult = (data) => {
    setLastPrediction(data);
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAuthModal={handleOpenAuth}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Predict Tab */}
        {activeTab === 'predict' && (
          <div className="predict-layout">
            <div className="predict-column">
              <PredictForm onPredictionResult={handlePredictionResult} />
            </div>

            <div className="result-column">
              {lastPrediction ? (
                <ResultCard result={lastPrediction} />
              ) : (
                <div className="card placeholder-card">
                  <div className="placeholder-content">
                    <div className="pulse-dot"></div>
                    <h3>Ready for Assessment</h3>
                    <p>Enter patient vitals or click a preset on the left, then click <strong>Evaluate Risk Level</strong> to generate an instant prediction.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          isAuthenticated ? (
            <HistoryView />
          ) : (
            <div className="card auth-required-card">
              <h2>Authentication Required</h2>
              <p>Please log in or create an account to access your saved PostgreSQL assessment history.</p>
              <button
                className="btn-primary"
                onClick={() => handleOpenAuth('login')}
              >
                Log In to View History
              </button>
            </div>
          )
        )}

        {/* Architecture & DB Tab */}
        {activeTab === 'about' && (
          <ArchitectureView />
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Maternal Health Risk Predictor &bull; React Frontend &amp; PostgreSQL-Powered Flask Backend</p>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
