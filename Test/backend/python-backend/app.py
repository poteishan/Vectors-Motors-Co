from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime
import logging

app = Flask(__name__, static_folder='../../frontend')
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# File paths
TRAINING_DATA_PATH = 'training_data.json'
CHAT_LOGS_PATH = '../../data/chat_logs.json'
BOOKINGS_PATH = '../../data/service_bookings.json'

# ATV Knowledge Base
ATV_KNOWLEDGE_BASE = {
    "maintenance": [
        {"q": "oil change frequency", "a": "Every 50 hours or 6 months. Use SAE 10W-40 4-stroke oil."},
        {"q": "tire pressure", "a": "Front: 5-7 PSI, Rear: 4-6 PSI. Check when cold."}
    ],
    "troubleshooting": [
        {"q": "wont start", "a": "Check: Battery, Fuel, Spark plug, Kill switch, Clutch."},
        {"q": "overheating", "a": "Check coolant, Radiator, Thermostat, Water pump."}
    ]
}

def load_training_data():
    """Load training data from file"""
    try:
        if os.path.exists(TRAINING_DATA_PATH):
            with open(TRAINING_DATA_PATH, 'r') as f:
                return json.load(f)
    except Exception as e:
        logger.error(f"Error loading training data: {e}")
    return []

def save_training_data(data):
    """Save training data to file"""
    try:
        with open(TRAINING_DATA_PATH, 'w') as f:
            json.dump(data, f, indent=2)
        return True
    except Exception as e:
        logger.error(f"Error saving training data: {e}")
        return False

def log_interaction(user_message, ai_response, model_used="demo"):
    """Log chat interactions"""
    try:
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "user_message": user_message,
            "ai_response": ai_response,
            "model_used": model_used
        }
        
        # Create data directory if it doesn't exist
        os.makedirs(os.path.dirname(CHAT_LOGS_PATH), exist_ok=True)
        
        # Append to log file
        with open(CHAT_LOGS_PATH, 'a') as f:
            f.write(json.dumps(log_entry) + '\n')
    except Exception as e:
        logger.error(f"Error logging interaction: {e}")

@app.route('/')
def serve_frontend():
    """Serve the frontend HTML file"""
    return send_from_directory('../../frontend', 'index.html')

@app.route('/<path:path>')
def serve_static_files(path):
    """Serve static files (CSS, JS, images)"""
    return send_from_directory('../../frontend', path)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'ATV AI Assistant API',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat(),
        'endpoints': {
            '/api/chat': 'POST - Chat with AI',
            '/api/train': 'POST - Add training data',
            '/api/bookings': 'POST - Create service booking',
            '/api/parts': 'GET - Get spare parts list'
        }
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    """Main chat endpoint"""
    try:
        data = request.json
        user_message = data.get('message', '').strip()
        context = data.get('context', '')
        model_requested = data.get('model', 'demo')
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
        logger.info(f"Chat request: {user_message[:50]}...")
        
        # Check knowledge base first
        ai_response = check_knowledge_base(user_message)
        
        # If not found in knowledge base, generate response
        if not ai_response:
            ai_response = generate_ai_response(user_message, model_requested)
        
        # Log the interaction
        log_interaction(user_message, ai_response, model_requested)
        
        return jsonify({
            'response': ai_response,
            'model_used': model_requested,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        return jsonify({
            'response': 'I apologize, but I encountered an error. Please try again.',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

def check_knowledge_base(query):
    """Check if query exists in knowledge base"""
    query_lower = query.lower()
    
    # Check training data
    training_data = load_training_data()
    for item in training_data:
        if item.get('q', '').lower() in query_lower or query_lower in item.get('q', '').lower():
            return item.get('a', '')
    
    # Check built-in knowledge base
    for category in ATV_KNOWLEDGE_BASE.values():
        for item in category:
            if item.get('q', '').lower() in query_lower or query_lower in item.get('q', '').lower():
                return item.get('a', '')
    
    return None

def generate_ai_response(query, model_type="demo"):
    """Generate AI response based on model type"""
    query_lower = query.lower()
    
    # Enhanced demo responses
    demo_responses = {
        'oil': 'For ATV engines, use SAE 10W-40 4-stroke oil. Change every 50 hours. Service: ₹1,500.',
        'brake': 'Brake service: ₹3,000. Pads: Front ₹800, Rear ₹900. Check monthly.',
        'tire': 'Tire pressure: Front 5-7 PSI, Rear 4-6 PSI. Replace every 2-3 years.',
        'service': 'Regular service: ₹1,500, Full service: ₹6,000. Book via chatbot.',
        'problem': 'For diagnosis, visit service center or call 1800-VECTORS-1.',
        'hello': 'Hello! I\'m your ATV assistant. How can I help?',
        'thanks': 'You\'re welcome! Safe riding! 🏍️'
    }
    
    # Check for keywords
    for keyword, response in demo_responses.items():
        if keyword in query_lower:
            return response
    
    # Context-based responses
    if any(word in query_lower for word in ['how', 'what', 'when', 'where', 'why']):
        return "That's a technical question about ATV maintenance. For detailed advice, I recommend booking a diagnostic service or calling our experts at 1800-VECTORS-1."
    
    if 'price' in query_lower or 'cost' in query_lower:
        return "Service prices: Regular ₹1,500, Full ₹6,000. Parts: Oil filter ₹250, Brake pads ₹800-900, Tires ₹4,500-5,200."
    
    return "I understand your ATV concern. For accurate diagnosis and repair, please visit our service center or use the booking system above."

@app.route('/api/train', methods=['POST'])
def train():
    """Add training examples"""
    try:
        data = request.json
        question = data.get('question', '').strip()
        answer = data.get('answer', '').strip()
        
        if not question or not answer:
            return jsonify({'error': 'Both question and answer are required'}), 400
        
        # Load existing training data
        training_data = load_training_data()
        
        # Add new training example
        training_data.append({
            'q': question.lower(),
            'a': answer,
            'timestamp': datetime.now().isoformat()
        })
        
        # Save updated training data
        if save_training_data(training_data):
            logger.info(f"Training example added: {question[:50]}...")
            return jsonify({
                'success': True,
                'message': 'Training example saved successfully',
                'total_examples': len(training_data),
                'timestamp': datetime.now().isoformat()
            })
        else:
            return jsonify({'error': 'Failed to save training data'}), 500
            
    except Exception as e:
        logger.error(f"Training error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    """Create a service booking"""
    try:
        booking_data = request.json
        
        # Validate required fields
        required_fields = ['name', 'phone', 'vehicleReg', 'service', 'preferredDate']
        for field in required_fields:
            if field not in booking_data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Add timestamp and booking ID
        booking_data['bookingId'] = f"VM{datetime.now().strftime('%Y%m%d%H%M%S')}"
        booking_data['createdAt'] = datetime.now().isoformat()
        booking_data['status'] = 'pending'
        
        # Load existing bookings
        try:
            if os.path.exists(BOOKINGS_PATH):
                with open(BOOKINGS_PATH, 'r') as f:
                    bookings = json.load(f)
            else:
                bookings = []
        except:
            bookings = []
        
        # Add new booking
        bookings.append(booking_data)
        
        # Save bookings
        os.makedirs(os.path.dirname(BOOKINGS_PATH), exist_ok=True)
        with open(BOOKINGS_PATH, 'w') as f:
            json.dump(bookings, f, indent=2)
        
        logger.info(f"Booking created: {booking_data['bookingId']}")
        
        return jsonify({
            'success': True,
            'bookingId': booking_data['bookingId'],
            'message': 'Booking created successfully',
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Booking error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/parts', methods=['GET'])
def get_parts():
    """Get spare parts list"""
    parts_data = {
        'engine': [
            {'name': 'Oil Filter', 'price': 250, 'category': 'engine'},
            {'name': 'Engine Oil (1L)', 'price': 400, 'category': 'engine'},
            {'name': 'Spark Plug', 'price': 300, 'category': 'engine'},
            {'name': 'Carburetor Assembly', 'price': 2500, 'category': 'engine'}
        ],
        'suspension': [
            {'name': 'Shock Absorber (Front)', 'price': 3500, 'category': 'suspension'},
            {'name': 'Shock Absorber (Rear)', 'price': 3800, 'category': 'suspension'},
            {'name': 'Spring Kit', 'price': 2200, 'category': 'suspension'},
            {'name': 'Suspension Linkage', 'price': 1800, 'category': 'suspension'}
        ],
        'brakes': [
            {'name': 'Brake Pad Set (Front)', 'price': 800, 'category': 'brakes'},
            {'name': 'Brake Pad Set (Rear)', 'price': 900, 'category': 'brakes'},
            {'name': 'Brake Disc (Front)', 'price': 1200, 'category': 'brakes'},
            {'name': 'Brake Disc (Rear)', 'price': 1500, 'category': 'brakes'},
            {'name': 'Brake Fluid (500ml)', 'price': 350, 'category': 'brakes'}
        ],
        'tires': [
            {'name': 'All-Terrain Tire (Front)', 'price': 4500, 'category': 'tires'},
            {'name': 'All-Terrain Tire (Rear)', 'price': 5200, 'category': 'tires'},
            {'name': 'Tire Repair Kit', 'price': 200, 'category': 'tires'}
        ],
        'transmission': [
            {'name': 'Clutch Plate', 'price': 1200, 'category': 'transmission'},
            {'name': 'Drive Belt', 'price': 2800, 'category': 'transmission'},
            {'name': 'Sprocket Set', 'price': 2100, 'category': 'transmission'}
        ]
    }
    
    return jsonify({
        'parts': parts_data,
        'count': sum(len(category) for category in parts_data.values()),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/logs', methods=['GET'])
def get_logs():
    """Get chat logs (for admin)"""
    try:
        if os.path.exists(CHAT_LOGS_PATH):
            logs = []
            with open(CHAT_LOGS_PATH, 'r') as f:
                for line in f:
                    try:
                        logs.append(json.loads(line.strip()))
                    except:
                        continue
            
            return jsonify({
                'logs': logs[-100:],  # Last 100 logs
                'total': len(logs),
                'timestamp': datetime.now().isoformat()
            })
        else:
            return jsonify({'logs': [], 'total': 0})
    except Exception as e:
        logger.error(f"Error getting logs: {e}")
        return jsonify({'logs': [], 'error': str(e)})

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('../../data', exist_ok=True)
    
    # Start the server
    print("🚀 Starting Vectors Motors AI Chatbot Server...")
    print("🌐 Frontend: http://localhost:5000")
    print("📊 API Health: http://localhost:5000/api/health")
    print("🤖 AI Endpoint: http://localhost:5000/api/chat")
    
    app.run(host='0.0.0.0', port=5000, debug=True)