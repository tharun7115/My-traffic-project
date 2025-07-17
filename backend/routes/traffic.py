from flask import Blueprint, request, jsonify

traffic_bp = Blueprint('traffic', __name__)

# Categorized Bangalore areas
BANGALORE_LOCATIONS = {
    'high': ['koramangala', 'indiranagar', 'whitefield', 'electronic city'],
    'medium': ['jayanagar', 'hsr layout', 'btm layout'],
    'low': ['hosur road', 'doddaballapur', 'bannerghatta road']
}

TRAFFIC_CAUSES = {
    'high': ["Accident", "Roadwork", "Heavy Traffic"],
    'medium': ["Moderate Traffic", "Public Event", "Minor Accident"],
    'low': ["Flood", "Vehicle Breakdown", "None"]
}

def get_traffic_cause(location):
    for zone, locations in BANGALORE_LOCATIONS.items():
        if any(location.lower().find(loc) != -1 for loc in locations):
            causes = TRAFFIC_CAUSES[zone]
            return {
                'cause': causes[0],
                'congestion_level': zone.capitalize(),
                'alternate_route': f"via {causes[1] if len(causes) > 1 else 'nearby road'}"
            }
    return {
        'cause': 'Unknown',
        'congestion_level': 'Unknown',
        'alternate_route': 'No alternate route found'
    }

@traffic_bp.route('/api/traffic', methods=['GET'])
def get_traffic_info():
    source = request.args.get('source')
    destination = request.args.get('destination')

    if not source or not destination:
        return jsonify({"error": "Missing source or destination"}), 400

    result = get_traffic_cause(source)
    result.update({
        'source': source,
        'destination': destination
    })

    return jsonify(result)