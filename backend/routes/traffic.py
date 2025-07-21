from flask import Blueprint, request, jsonify
from database import db
from models import SearchHistory

traffic_bp = Blueprint('traffic', __name__)

@traffic_bp.route('/api/save-search', methods=['POST'])
def save_search():
    data = request.get_json()
    
    # In a real app, you would get the user_id from a login session/token.
    # We will hardcode user_id=1 for this example.
    user_id = 1 
    
    source = data.get('source')
    destination = data.get('destination')

    if not source or not destination:
        return jsonify({"error": "Missing source or destination"}), 400

    new_search = SearchHistory(
        user_id=user_id, 
        source=source, 
        destination=destination
    )
    db.session.add(new_search)
    db.session.commit()
    
    return jsonify({'message': 'Search saved'}), 201