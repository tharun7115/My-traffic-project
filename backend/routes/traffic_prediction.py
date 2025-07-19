from flask import Blueprint, jsonify, current_app
import joblib
from datetime import datetime
import pandas as pd
import os

traffic_prediction_bp = Blueprint('traffic_prediction_bp', __name__)

model = None

def load_traffic_model():
    """Loads the model using the app context."""
    global model
    model_path = os.path.join(current_app.root_path, 'traffic_model.pkl')
    model = joblib.load(model_path)
    print("Traffic prediction model loaded successfully.")

@traffic_prediction_bp.route('/api/predict-traffic', methods=['POST'])
def predict_traffic():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
        
    now = datetime.now()
    # ✅ FIX: Use the correct feature names and methods the model was trained on
    hour_of_day = now.hour
    day_of_week = now.weekday() # Monday=0, Sunday=6, matches training data

    # Use the correct column names for the prediction
    input_data = pd.DataFrame([[hour_of_day, day_of_week]], columns=['Hour', 'Day_of_Week'])
    
    predicted_volume = model.predict(input_data)[0]

    if predicted_volume < 200:
        traffic_condition = "Light"
    elif predicted_volume < 500:
        traffic_condition = "Moderate"
    else:
        traffic_condition = "Heavy"

    return jsonify({
        'predicted_traffic_condition': traffic_condition,
        'predicted_volume': round(predicted_volume)
    })