from database import create_app
from flask_cors import CORS

app = create_app()
CORS(app)  # Allow all origins (for development only)

@app.route('/')
def home():
    return "Traffic Assistant API is running!"

if __name__ == '__main__':
    app.run(debug=True)