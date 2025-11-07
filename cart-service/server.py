import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from config.db import connect_db
from routes.cartRoutes import cart_routes
from messaging.consumer import RabbitMQConsumer

# Load environment variables
load_dotenv()

def create_app():
    """Create and configure Flask application"""
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app)
    
    # Connect to MongoDB
    db = connect_db()
    if db is None:
        raise Exception("Failed to connect to MongoDB")
    
    # Store db instance in app config
    app.config['db'] = db
    
    # Initialize cart controller with db instance
    from routes.cartRoutes import init_controller
    init_controller(db)
    
    # Register blueprints
    app.register_blueprint(cart_routes)
    
    # Start RabbitMQ consumer
    consumer = RabbitMQConsumer()
    consumer.daemon = True  # Allow the thread to shutdown with the main thread
    consumer.start()
    
    @app.route('/health')
    def health_check():
        """Health check endpoint"""
        return {'status': 'healthy'}, 200
    
    @app.route('/ready')
    def ready_check():
        """Ready check endpoint"""
        return {'status': 'ready'}, 200

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5004))
    
    print(f"🚀 Cart Service starting on port {port}")
    app.run(host='0.0.0.0', port=port)