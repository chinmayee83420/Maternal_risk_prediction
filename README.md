# Maternal Health Risk Predictor 🤰✨

A decoupled, microservices-based Machine Learning web application featuring:
- **Express.js Backend (Node.js)**: Handles User Authentication (Register, Login, JWT verification, bcrypt hashing) and PostgreSQL database persistence.
- **Python ML Microservice (Flask + TensorFlow/Keras)**: Pure machine learning inference engine evaluating 6 clinical vitals with feature scaling and deep neural network classification.
- **React Frontend (Vite)**: Modern, responsive UI with interactive forms, presets, health risk visualization gauges, and history tracking.

---

## 📁 Clean Project Architecture

```
maternalproject/
│
├── express-backend/                 # Node.js + Express Authentication & Gateway (Port 5000)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                # Sequelize ORM + PostgreSQL connection configuration
│   │   ├── controllers/
│   │   │   ├── authController.js    # Register, Login, Me handlers
│   │   │   ├── predictController.js # Forwards vitals to Python ML service + persists history
│   │   │   └── historyController.js # History retrieval and deletion handlers
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT verification middleware & token generation
│   │   ├── models/
│   │   │   ├── User.js              # User schema with salted bcrypt hashing
│   │   │   ├── PredictionHistory.js # Prediction records linked to users
│   │   │   └── index.js             # Model associations & table auto-sync
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # /api/auth/*
│   │   │   ├── predictRoutes.js     # /api/predict
│   │   │   └── historyRoutes.js     # /api/history/*
│   │   └── server.js                # Express app entry point & middleware setup
│   ├── .env.example                 # Environment variables template
│   ├── .env                         # Local database credentials & JWT secrets
│   ├── package.json                 # Express dependencies
│   └── test-e2e.js                  # Automated end-to-end API test script
│
├── python-backend/                  # Python ML Prediction Microservice (Port 8000)
│   ├── app.py                       # Lightweight Flask prediction endpoint (/predict)
│   ├── model_helper.py              # StandardScaler preprocessor & Keras model inference
│   ├── my_model.keras               # Pre-trained deep learning neural network
│   ├── Maternal Health Risk Data Set.csv # Reference dataset for scaler normalization
│   ├── requirements.txt             # Python dependencies (Flask, TensorFlow, Scikit-learn)
│   ├── .env.example                 # Environment template
│   └── .env                         # Service port configuration (PORT=8000)
│
├── frontend/                        # Modern React Single Page Application (Port 5173)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Top header with user profile badge & auth triggers
│   │   │   ├── AuthModal.jsx        # Login and Registration modal dialog
│   │   │   ├── PredictForm.jsx      # Health input form with clinical presets
│   │   │   ├── ResultCard.jsx       # Risk badge, score gauge & medical advice
│   │   │   ├── HistoryView.jsx      # Saved PostgreSQL assessment history table
│   │   │   └── ArchitectureView.jsx # Interactive full-stack system architecture diagram
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global authentication state (JWT storage)
│   │   ├── services/
│   │   │   └── api.js               # Centralized Fetch API client
│   │   ├── App.jsx                  # Main application layout
│   │   ├── App.css                  # Responsive styles
│   │   └── index.css                # CSS tokens & typography
│   ├── package.json                 # React dependencies
│   └── vite.config.js               # Vite dev server with proxy to Express backend
│
├── notebooks/                       # Training Notebooks & Raw Data
│   ├── training.ipynb               # Jupyter notebook used for neural network training
│   └── Maternal Health Risk Data Set.csv # Dataset copy
│
├── package.json                     # Root developer convenience scripts
├── .gitignore                       # Clean Git ignore rules
└── README.md                        # Documentation
```

---

## 🚀 How to Run the Application

To run the complete system, open 3 separate terminal tabs or windows:

### 1️⃣ Start the Python ML Service (Port 8000)
```powershell
cd python-backend
..\.venv\Scripts\python.exe app.py
```
*Outputs: `Running on http://127.0.0.1:8000` with Neural network model loaded.*

---

### 2️⃣ Start the Express Backend (Port 5000)
```powershell
cd express-backend
npm run dev
```
*Outputs: `Running on http://localhost:5000` with PostgreSQL connected and models synced.*

---

### 3️⃣ Start the React Frontend (Port 5173)
```powershell
cd frontend
npm run dev
```
*Outputs: `Local: http://localhost:5173`.*

Open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 🧪 Automated Testing

To test the entire Express authentication, PostgreSQL connection, and Python ML prediction pipeline automatically in one command:

```powershell
cd express-backend
npm test
```

---

## 🐘 PostgreSQL Configuration

The Express backend connects to PostgreSQL using **Sequelize ORM** and automatically creates/syncs the `users` and `prediction_history` tables on startup.

1. Create a database in PostgreSQL:
   ```sql
   CREATE DATABASE maternal_db;
   ```
2. Update your connection details in `express-backend/.env`:
   ```ini
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/maternal_db
   JWT_SECRET=maternal_super_secret_jwt_key_2026
   PORT=5000
   PYTHON_ML_URL=http://127.0.0.1:8000/predict
   ```

---

## 📡 REST API Specifications

| Method | Endpoint | Microservice | Auth Required | Description |
|---|---|---|---|---|
| `GET` | `/api/health` | Express + Python | No | Health check for Express, PostgreSQL, and Python ML service |
| `POST` | `/api/auth/register` | Express | No | Register new user (Username, Email, Password with bcrypt hashing) |
| `POST` | `/api/auth/login` | Express | No | User login & JWT token issuance |
| `GET` | `/api/auth/me` | Express | Yes (`Bearer <token>`) | Get profile of logged-in user |
| `POST` | `/api/predict` | Express ➔ Python | Optional | Express forwards vitals to Python ML model & saves history |
| `GET` | `/api/history` | Express | Yes (`Bearer <token>`) | Retrieve user prediction history from PostgreSQL |
| `DELETE` | `/api/history/:id` | Express | Yes (`Bearer <token>`) | Delete specific history record |

---

## 🧠 Machine Learning Model Information

- **Inputs (6 Features)**: Age, Systolic BP, Diastolic BP, Blood Sugar (BS), Body Temperature, Heart Rate.
- **Normalization**: `StandardScaler` fitted on the maternal health dataset.
- **Model**: Multi-layer Dense Neural Network (`my_model.keras`) trained on clinical maternal vitals.
- **Risk Classification**:
  - **Low Risk** (< 35% probability)
  - **Mid Risk** (35% – 70% probability)
  - **High Risk** (≥ 70% probability)
