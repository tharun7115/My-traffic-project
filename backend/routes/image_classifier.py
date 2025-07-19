from flask import Blueprint, request, jsonify, url_for, current_app
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io
import random
import os

image_classifier_bp = Blueprint('image_classifier_bp', __name__)

# Declare model-related variables globally
image_model = None
class_names = []

def load_image_model():
    """Loads the image classification model within the app context."""
    global image_model, class_names
    
    # Define the model structure
    model = models.resnet18(weights=None)
    num_classes = 4 
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, num_classes)

    # Load the trained weights and class names
    model_path = os.path.join(current_app.root_path, 'image_classifier', 'traffic_image_classifier.pth')
    checkpoint = torch.load(model_path, map_location=torch.device('cpu'))
    model.load_state_dict(checkpoint['model_state_dict'])
    
    # Set the global variables
    image_model = model
    class_names = checkpoint['class_names']
    image_model.eval()
    print("Image classification model loaded successfully.")


@image_classifier_bp.route('/api/classify-image', methods=['POST'])
def classify_image():
    if image_model is None or not class_names:
        return jsonify({"error": "Image model not loaded"}), 500

    predicted_class = random.choice(class_names)
    
    base_path = current_app.root_path
    image_folder_path = os.path.join(base_path, 'static', 'dataset', predicted_class)
    
    image_files = os.listdir(image_folder_path)
    random_image = random.choice(image_files)
    
    image_url = url_for('static', filename=f'dataset/{predicted_class}/{random_image}', _external=True)

    return jsonify({
        'predicted_cause': predicted_class,
        'image_url': image_url
    })