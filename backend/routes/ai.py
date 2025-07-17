from flask import Blueprint, request, jsonify
from ai_model.predict import predict_cause
import os

ai_bp = Blueprint('ai', __name__)

UPLOAD_FOLDER = 'uploads/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@ai_bp.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files['image']
    image_path = os.path.join(UPLOAD_FOLDER, image.filename)
    image.save(image_path)

    cause = predict_cause(image_path)
    os.remove(image_path)  # Optional: delete after prediction

    return jsonify({
        "cause": cause,
        "alternate_route": f"via {cause} route"
    })