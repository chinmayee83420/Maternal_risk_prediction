import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, User, LogIn, LogOut, History, Shield } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, openAuthModal }) {
  const { user, isAuthenticated, logoutUser } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo and Brand */}
        <div className="nav-brand" onClick={() => setActiveTab('predict')}>
          <div className="logo-icon">
            <Activity className="icon-main" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-title">MaternalGuard</span>
            <span className="brand-subtitle">Health Risk AI</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'predict' ? 'active' : ''}`}
            onClick={() => setActiveTab('predict')}
          >
            <Activity size={18} />
            <span>Risk Predictor</span>
          </button>

          {isAuthenticated && (
            <button
              className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <History size={18} />
              <span>Assessment History</span>
            </button>
          )}

          <button
            className={`nav-tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <Shield size={18} />
            <span>Architecture & DB</span>
          </button>
        </div>

        {/* User Auth Section */}
        <div className="nav-auth">
          {isAuthenticated ? (
            <div className="user-profile">
              <div className="user-badge">
                <User size={16} />
                <span className="username">{user?.username}</span>
              </div>
              <button className="btn-logout" onClick={logoutUser} title="Log Out">
                <LogOut size={16} />
                <span className="btn-text">Log Out</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button
                className="btn-login"
                onClick={() => openAuthModal('login')}
              >
                <LogIn size={16} />
                <span>Log In</span>
              </button>
              <button
                className="btn-register"
                onClick={() => openAuthModal('register')}
              >
                <span>Register</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
