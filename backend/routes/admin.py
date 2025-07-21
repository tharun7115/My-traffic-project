from flask import Blueprint, request, jsonify
from database import db
from models import User, SearchHistory

admin_bp = Blueprint('admin', __name__)

# Hardcoded admin credentials
ADMIN_CREDENTIALS = {
    "email": "admin@example.com",
    "password": "admin123"
}

@admin_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # ✅ ADD THIS LINE FOR DEBUGGING
    print(f"Received login attempt: Email='{email}', Password='{password}'")

    if email == ADMIN_CREDENTIALS['email'] and password == ADMIN_CREDENTIALS['password']:
        return jsonify({"message": "Admin login successful"}), 200
        
    return jsonify({"error": "Invalid admin credentials"}), 401

# --- (rest of the file remains the same) ---
@admin_bp.route('/api/admin/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    users_data = [{
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'searches': [{'source': s.source, 'destination': s.destination} for s in user.searches]
    } for user in users]
    return jsonify(users_data), 200

@admin_bp.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User and their search history deleted successfully'}), 200