/**
 * script.js
 * ---------
 * Simple Vanilla JavaScript for Maternal Health Risk Prediction.
 * 
 * Flow:
 * 1. Listen for form submit event.
 * 2. Prevent the default browser reload (event.preventDefault).
 * 3. Extract user input values.
 * 4. Send an HTTP POST request to Flask endpoint '/predict' using fetch().
 * 5. Handle the response and update the webpage dynamically.
 */

// Wait for DOM to load completely
document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const form = document.getElementById("predictionForm");
    const submitBtn = document.getElementById("submitBtn");
    const btnText = document.getElementById("btnText");
    const btnSpinner = document.getElementById("btnSpinner");
    
    const resultSection = document.getElementById("resultSection");
    const riskBadge = document.getElementById("riskBadge");
    const rawScore = document.getElementById("rawScore");
    const recommendationText = document.getElementById("recommendationText");
    
    const errorAlert = document.getElementById("errorAlert");
    const errorMessage = document.getElementById("errorMessage");

    // Input fields
    const ageInput = document.getElementById("age");
    const systolicInput = document.getElementById("systolic_bp");
    const diastolicInput = document.getElementById("diastolic_bp");
    const bloodSugarInput = document.getElementById("blood_sugar");
    const bodyTempInput = document.getElementById("body_temp");
    const heartRateInput = document.getElementById("heart_rate");

    // Preset buttons
    const presetLowBtn = document.getElementById("presetLow");
    const presetHighBtn = document.getElementById("presetHigh");
    const btnClear = document.getElementById("btnClear");

    // Preset 1: Low Risk Sample Data (e.g. from dataset row 4)
    presetLowBtn.addEventListener("click", () => {
        ageInput.value = 35;
        systolicInput.value = 120;
        diastolicInput.value = 60;
        bloodSugarInput.value = 6.1;
        bodyTempInput.value = 98.0;
        heartRateInput.value = 76;
        hideAlerts();
    });

    // Preset 2: High Risk Sample Data (e.g. from dataset row 0)
    presetHighBtn.addEventListener("click", () => {
        ageInput.value = 25;
        systolicInput.value = 130;
        diastolicInput.value = 80;
        bloodSugarInput.value = 15.0;
        bodyTempInput.value = 98.0;
        heartRateInput.value = 86;
        hideAlerts();
    });

    // Clear Form Button
    btnClear.addEventListener("click", () => {
        form.reset();
        hideAlerts();
        resultSection.style.display = "none";
    });

    // Helper function to hide error alert
    function hideAlerts() {
        errorAlert.style.display = "none";
        errorMessage.textContent = "";
    }

    // Helper function to show error alert
    function showError(msg) {
        errorMessage.textContent = msg;
        errorAlert.style.display = "block";
        resultSection.style.display = "none";
    }

    // Handle Form Submission
    form.addEventListener("submit", async (event) => {
        // Prevent default browser form submission (which causes page reload)
        event.preventDefault();
        hideAlerts();

        // 1. Collect inputs into a JavaScript object
        const payload = {
            age: parseFloat(ageInput.value),
            systolic_bp: parseFloat(systolicInput.value),
            diastolic_bp: parseFloat(diastolicInput.value),
            blood_sugar: parseFloat(bloodSugarInput.value),
            body_temp: parseFloat(bodyTempInput.value),
            heart_rate: parseFloat(heartRateInput.value)
        };

        // 2. Set button loading state
        submitBtn.disabled = true;
        btnText.textContent = "Predicting...";
        btnSpinner.style.display = "inline-block";

        try {
            // 3. Send POST request to Flask backend
            const response = await fetch("/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            // 4. Check if request was successful
            if (response.ok && data.success) {
                const result = data.data;

                // Update Risk Badge text and CSS class
                riskBadge.textContent = result.risk_level;
                riskBadge.className = "badge " + result.risk_class;

                // Update details
                rawScore.textContent = result.raw_score;
                recommendationText.textContent = result.recommendation;

                // Show the result section with smooth scroll
                resultSection.style.display = "block";
                resultSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
            } else {
                // Server returned an error message
                showError(data.error || "An error occurred during prediction.");
            }

        } catch (err) {
            // Network or parsing error
            console.error("Fetch error:", err);
            showError("Could not connect to Flask server. Please ensure app.py is running.");
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            btnText.textContent = "Predict Risk";
            btnSpinner.style.display = "none";
        }
    });
});
