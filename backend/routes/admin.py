from flask import Blueprint, request, jsonify
from models import User
from database import db, bcrypt

admin_bp = Blueprint('admin', __name__)

# Hardcoded admin credentials (you can later move this to DB)
ADMIN_CREDENTIALS = {
    "email": "admin@example.com",
    "password": "admin123"
}

@admin_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if email == ADMIN_CREDENTIALS['email'] and password == ADMIN_CREDENTIALS['password']:
        return jsonify({"message": "Admin login successful"}), 200
    return jsonify({"error": "Invalid admin credentials"}), 401


@admin_bp.route('/admin/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    return jsonify([{
        'id': user.id,
        'username': user.username,
        'email': user.email
    } for user in users]), 200