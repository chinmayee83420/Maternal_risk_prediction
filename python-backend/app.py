"""
python-backend/app.py
---------------------
Dedicated Python Microservice for Maternal Risk Prediction (Keras Neural Network).
Exposes REST endpoints for health checks and machine learning inference on Port 8000.
"""

import os
from flask import Flask, request, jsonify

# Optional imports with fallbacks
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from model_helper import predict_risk

app = Flask(__name__)

# CORS Support
try:
    from flask_cors import CORS
    CORS(app, resources={r"/*": {"origins": "*"}})
except ImportError:
    @app.after_request
    def after_request(response):
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
        return response


@app.route("/", methods=["GET"])
@app.route("/health", methods=["GET"])
@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint for the Python ML inference service."""
    return jsonify({
        "status": "online",
        "service": "Maternal Risk Python ML Service (TensorFlow / Keras)",
        "version": "2.0.0"
    }), 200


@app.route("/predict", methods=["POST", "OPTIONS"])
@app.route("/api/predict", methods=["POST", "OPTIONS"])
def predict():
    """
    Receives maternal vitals, runs prediction through the Keras model,
    and returns risk classification, probability score, and recommendation.
    """
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({
                "success": False,
                "error": "No health parameters provided in request body."
            }), 400

        # Extract parameters with fallbacks
        age = float(data.get("age", 0))
        systolic_bp = float(data.get("systolic_bp", 0))
        diastolic_bp = float(data.get("diastolic_bp", 0))
        blood_sugar = float(data.get("blood_sugar", 0))
        body_temp = float(data.get("body_temp", 0))
        heart_rate = float(data.get("heart_rate", 0))

        # Validate input ranges
        if age <= 0 or age > 120:
            return jsonify({"success": False, "error": "Age must be between 1 and 120."}), 400
        if systolic_bp <= 0 or diastolic_bp <= 0:
            return jsonify({"success": False, "error": "Blood pressure values must be greater than 0."}), 400
        if blood_sugar <= 0:
            return jsonify({"success": False, "error": "Blood sugar level must be greater than 0."}), 400
        if body_temp <= 80 or body_temp > 115:
            return jsonify({"success": False, "error": "Body temperature must be in °F (85°F - 115°F)."}), 400
        if heart_rate <= 0 or heart_rate > 250:
            return jsonify({"success": False, "error": "Heart rate must be between 30 and 220 bpm."}), 400

        # Perform ML prediction
        result = predict_risk(
            age=age,
            systolic_bp=systolic_bp,
            diastolic_bp=diastolic_bp,
            blood_sugar=blood_sugar,
            body_temp=body_temp,
            heart_rate=heart_rate
        )

        return jsonify({
            "success": True,
            "data": result
        }), 200

    except ValueError as ve:
        return jsonify({"success": False, "error": f"Invalid numerical value: {str(ve)}"}), 400
    except Exception as e:
        return jsonify({"success": False, "error": f"Prediction service error: {str(e)}"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"[INFO] Starting Python ML Prediction Service on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
