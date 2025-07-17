from database import create_app
from flask_cors import CORS
from routes.traffic import traffic_bp

app = create_app()
CORS(app)

# Import and register blueprints
from routes.admin import admin_bp
app.register_blueprint(admin_bp)
app.register_blueprint(traffic_bp)

@app.route('/')
def home():
    return "Traffic Assistant API is running!"

if __name__ == '__main__':
    app.run(debug=True)