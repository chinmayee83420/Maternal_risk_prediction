"""
app.py
------
Simple Flask Backend for Maternal Health Risk Prediction.
This server:
1. Serves the web page (index.html) at route '/'
2. Receives input data from JavaScript via POST request at '/predict'
3. Passes data to model_helper.py to compute prediction
4. Returns the result as JSON back to the frontend
"""

from flask import Flask, render_template, request, jsonify
from model_helper import predict_risk

# Create Flask app instance
app = Flask(__name__)

# Route 1: Serve the main HTML page
@app.route("/")
def home():
    """Renders the main frontend webpage."""
    return render_template("index.html")

# Route 2: API endpoint for predictions
@app.route("/predict", methods=["POST"])
def predict():
    """
    Receives JSON payload from frontend JavaScript,
    validates the inputs, runs prediction, and returns JSON.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No input data provided."}), 400

        # Extract and convert the 6 input fields to float
        age = float(data.get("age", 0))
        systolic_bp = float(data.get("systolic_bp", 0))
        diastolic_bp = float(data.get("diastolic_bp", 0))
        blood_sugar = float(data.get("blood_sugar", 0))
        body_temp = float(data.get("body_temp", 0))
        heart_rate = float(data.get("heart_rate", 0))

        # Basic range validation
        if age <= 0 or age > 120:
            return jsonify({"success": False, "error": "Please enter a valid age (1-120)."}), 400
        if systolic_bp <= 0 or diastolic_bp <= 0:
            return jsonify({"success": False, "error": "Blood pressure values must be greater than 0."}), 400
        if blood_sugar <= 0:
            return jsonify({"success": False, "error": "Blood sugar must be greater than 0."}), 400
        if body_temp <= 80 or body_temp > 115:
            return jsonify({"success": False, "error": "Body temperature should be in °F (between 85°F and 110°F)."}), 400
        if heart_rate <= 0 or heart_rate > 250:
            return jsonify({"success": False, "error": "Please enter a valid heart rate (30-220 bpm)."}), 400

        # Call prediction helper
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
        })

    except ValueError:
        return jsonify({"success": False, "error": "Invalid numerical values provided."}), 400
    except Exception as e:
        return jsonify({"success": False, "error": f"Server error: {str(e)}"}), 500


# Run the Flask app when script is executed directly
if __name__ == "__main__":
    print("Starting Maternal Health Prediction Web App...")
    print("Open http://127.0.0.1:5000 in your browser.")
    app.run(host="127.0.0.1", port=5000, debug=True)
