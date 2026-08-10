"""
model_helper.py
---------------
This module handles:
1. Loading the pre-trained Keras model (my_model.keras).
2. Fitting / applying the standard scaler (StandardScaler) to match the training process.
3. Providing a simple predict function for the Flask backend.
"""

import os
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import StandardScaler

# Path to model and dataset
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "my_model.keras")
DATA_PATH = os.path.join(BASE_DIR, "Maternal Health Risk Data Set.csv")

# 1. Initialize and fit the StandardScaler to match training.ipynb
# The 6 features used during training in order:
FEATURE_NAMES = ["Age", "SystolicBP", "DiastolicBP", "BloodSugar", "BodyTemp", "HeartRate"]

scaler = StandardScaler()

try:
    if os.path.exists(DATA_PATH):
        df = pd.read_csv(DATA_PATH)
        # In training.ipynb, "BS" was renamed to "BloodSugar"
        df.rename(columns={"BS": "BloodSugar"}, inplace=True)
        # Extract the 6 input features
        X_data = df[FEATURE_NAMES]
        scaler.fit(X_data)
        print("[INFO] StandardScaler successfully fitted on dataset features.")
    else:
        # Fallback pre-calculated means and standard deviations from training dataset
        scaler.mean_ = np.array([29.87179487, 113.14792899, 76.46055227, 8.72598619, 98.66568047, 74.30177515])
        scaler.scale_ = np.array([13.46774614, 15.38634887, 13.88899849, 3.29290074, 1.37040445, 8.08475253])
except Exception as e:
    print(f"[WARNING] Error fitting scaler from dataset: {e}")

# 2. Load the trained Keras model
print("[INFO] Loading my_model.keras...")
model = tf.keras.models.load_model(MODEL_PATH)
print("[INFO] Model loaded successfully!")


def predict_risk(age, systolic_bp, diastolic_bp, blood_sugar, body_temp, heart_rate):
    """
    Takes 6 raw input features, scales them, and returns prediction results.
    
    Parameters:
        age (float): Age of the patient (years)
        systolic_bp (float): Systolic blood pressure (mmHg)
        diastolic_bp (float): Diastolic blood pressure (mmHg)
        blood_sugar (float): Blood sugar (mmol/L)
        body_temp (float): Body temperature (°F)
        heart_rate (float): Heart rate (bpm)
        
    Returns:
        dict: Contains prediction score, risk level, and explanation.
    """
    # Create input DataFrame in the exact feature order expected by the model
    raw_df = pd.DataFrame([[age, systolic_bp, diastolic_bp, blood_sugar, body_temp, heart_rate]], columns=FEATURE_NAMES)
    
    # Scale input using the StandardScaler
    scaled_input = scaler.transform(raw_df)
    
    # Run prediction using the Keras model
    prediction_raw = model.predict(scaled_input, verbose=0)
    score = float(prediction_raw[0][0])
    
    # Interpret the output
    # In training.ipynb:
    # Target encoding was: 0: Low Risk, 1: Mid Risk, 2: High Risk
    # Output layer is Dense(1, activation='sigmoid')
    if score >= 0.70:
        risk_level = "High Risk"
        risk_class = "high-risk"
        recommendation = "High risk detected. Immediate consultation with a healthcare professional is advised."
    elif score >= 0.35:
        risk_level = "Mid Risk"
        risk_class = "mid-risk"
        recommendation = "Moderate risk detected. Regular maternal monitoring and checkups are recommended."
    else:
        risk_level = "Low Risk"
        risk_class = "low-risk"
        recommendation = "Parameters are within safe ranges. Maintain healthy diet, hydration, and routine checkups."
        
    return {
        "raw_score": round(score, 4),
        "risk_level": risk_level,
        "risk_class": risk_class,
        "recommendation": recommendation,
        "inputs_received": {
            "Age": age,
            "SystolicBP": systolic_bp,
            "DiastolicBP": diastolic_bp,
            "BloodSugar": blood_sugar,
            "BodyTemp": body_temp,
            "HeartRate": heart_rate
        }
    }
