from flask import Blueprint, request, jsonify
from models import User
from database import db, bcrypt
import logging

# ✅ Define auth_bp at the top
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if not username or not email or not password or password != confirm_password:
        return jsonify({"error": "Invalid input"}), 400

    # Check if username already exists
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already taken"}), 400

    # Check if email already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    # Create new user
    user = User(username=username, email=email)
    user.set_password(password)

    db.session.add(user)
    try:
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred"}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        return jsonify({"message": "Login successful", "username": user.username}), 200

    return jsonify({"error": "Invalid email or password"}), 401