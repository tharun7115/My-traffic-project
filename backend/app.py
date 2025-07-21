from database import create_app
from flask_cors import CORS

app = create_app()
CORS(app)

# Import and register blueprints
from routes.admin import admin_bp
from routes.traffic import traffic_bp
from routes.image_classifier import image_classifier_bp, load_image_model
from routes.traffic_prediction import traffic_prediction_bp, load_traffic_model
from routes.auth import auth_bp # ✅ Import the auth blueprint

app.register_blueprint(admin_bp)
app.register_blueprint(traffic_bp)
app.register_blueprint(image_classifier_bp)
app.register_blueprint(traffic_prediction_bp)
app.register_blueprint(auth_bp) # ✅ Register the auth blueprint

# Load both models within the application context
with app.app_context():
    load_traffic_model()
    load_image_model()

@app.route('/')
def home():
    return "Traffic Assistant API is running!"

if __name__ == '__main__':
    app.run(debug=True)