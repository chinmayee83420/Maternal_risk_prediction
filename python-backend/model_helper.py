"""
python-backend/model_helper.py
------------------------------
Loads the pre-trained Keras model and scales inputs with StandardScaler.
"""

import os
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import StandardScaler

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "my_model.keras")
DATA_PATH = os.path.join(BASE_DIR, "Maternal Health Risk Data Set.csv")

FEATURE_NAMES = ["Age", "SystolicBP", "DiastolicBP", "BloodSugar", "BodyTemp", "HeartRate"]

# Initialize StandardScaler
scaler = StandardScaler()

try:
    if os.path.exists(DATA_PATH):
        df = pd.read_csv(DATA_PATH)
        df.rename(columns={"BS": "BloodSugar"}, inplace=True)
        X_data = df[FEATURE_NAMES]
        scaler.fit(X_data)
        print(f"[INFO] StandardScaler fitted on dataset from {DATA_PATH}")
    else:
        # Precomputed means and std from original dataset
        scaler.mean_ = np.array([29.87179487, 113.14792899, 76.46055227, 8.72598619, 98.66568047, 74.30177515])
        scaler.scale_ = np.array([13.46774614, 15.38634887, 13.88899849, 3.29290074, 1.37040445, 8.08475253])
        print("[INFO] Using precomputed scaler parameters.")
except Exception as e:
    print(f"[WARNING] Scaler initialization issue: {e}")

# Load model
print(f"[INFO] Loading Keras model from: {MODEL_PATH}")
model = tf.keras.models.load_model(MODEL_PATH)
print("[INFO] Neural network model loaded successfully!")


def predict_risk(age, systolic_bp, diastolic_bp, blood_sugar, body_temp, heart_rate):
    """
    Takes 6 maternal health parameters, scales them, and computes prediction.
    """
    raw_df = pd.DataFrame([[age, systolic_bp, diastolic_bp, blood_sugar, body_temp, heart_rate]], columns=FEATURE_NAMES)
    scaled_input = scaler.transform(raw_df)
    
    prediction_raw = model.predict(scaled_input, verbose=0)
    score = float(prediction_raw[0][0])
    
    if score >= 0.70:
        risk_level = "High Risk"
        risk_class = "high-risk"
        recommendation = "High risk detected. Immediate consultation with a maternal healthcare professional is advised."
    elif score >= 0.35:
        risk_level = "Mid Risk"
        risk_class = "mid-risk"
        recommendation = "Moderate risk detected. Regular maternal monitoring and scheduled prenatal checkups are recommended."
    else:
        risk_level = "Low Risk"
        risk_class = "low-risk"
        recommendation = "Vitals are within safe ranges. Maintain a balanced diet, proper hydration, and routine checkups."
        
    return {
        "raw_score": round(score, 4),
        "risk_level": risk_level,
        "risk_class": risk_class,
        "recommendation": recommendation,
        "inputs": {
            "age": age,
            "systolic_bp": systolic_bp,
            "diastolic_bp": diastolic_bp,
            "blood_sugar": blood_sugar,
            "body_temp": body_temp,
            "heart_rate": heart_rate
        }
    }
