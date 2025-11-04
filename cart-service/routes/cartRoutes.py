from flask import Blueprint, request, jsonify
from controllers.cartController import CartController

cart_routes = Blueprint('cart_routes', __name__)
cart_controller = None

# Nota: La inicialización del controller se moverá a server.py
def init_controller(db):
    """Initialize controller with database instance"""
    global cart_controller
    if cart_controller is None:
        cart_controller = CartController(db)

@cart_routes.route('/api/cart/<user_id>', methods=['GET'])
def get_cart(user_id):
    """Get user's cart"""
    print(f"🛒 GET cart request for user: {user_id}")
    try:
        cart = cart_controller.get_cart(user_id)
        print(f"📦 Cart retrieved: {cart}")
        if cart is None:
            # Create empty cart if it doesn't exist
            cart = cart_controller.cart_model.create_cart(user_id)
            print(f"🆕 Created new cart: {cart}")
        return jsonify(cart), 200
    except Exception as e:
        print(f"❌ Error getting cart: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Internal server error"}), 500

@cart_routes.route('/api/cart/<user_id>/items', methods=['POST'])
def add_item(user_id):
    """Add item to cart"""
    print(f"🛒 POST add item request for user: {user_id}")
    try:
        item = request.json
        print(f"📝 Item data received: {item}")
        
        if not item:
            print("❌ No JSON data received")
            return jsonify({"message": "No data provided"}), 400
            
        if not all(k in item for k in ('book_id', 'quantity')):
            print(f"❌ Missing required fields. Received: {item}")
            return jsonify({"message": "Missing required fields: book_id, quantity"}), 400
            
        cart = cart_controller.add_item(user_id, item)
        print(f"📦 Cart after adding item: {cart}")
        
        if cart is None:
            print("❌ Cart controller returned None")
            return jsonify({"message": "Failed to add item"}), 400
        return jsonify(cart), 200
    except Exception as e:
        print(f"❌ Error adding item: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500

@cart_routes.route('/api/cart/<user_id>/items/<book_id>', methods=['PUT'])
def update_item(user_id, book_id):
    """Update item quantity"""
    try:
        data = request.json
        if 'quantity' not in data:
            return jsonify({"message": "Quantity is required"}), 400
            
        cart = cart_controller.update_item(user_id, book_id, data['quantity'])
        if cart is None:
            return jsonify({"message": "Cart or item not found"}), 404
        return jsonify(cart), 200
    except Exception as e:
        print(f"❌ Error updating item: {e}")
        return jsonify({"message": "Internal server error"}), 500

@cart_routes.route('/api/cart/<user_id>/items/<book_id>', methods=['DELETE'])
def remove_item(user_id, book_id):
    """Remove item from cart"""
    try:
        cart = cart_controller.remove_item(user_id, book_id)
        if cart is None:
            return jsonify({"message": "Cart or item not found"}), 404
        return jsonify(cart), 200
    except Exception as e:
        print(f"❌ Error removing item: {e}")
        return jsonify({"message": "Internal server error"}), 500

@cart_routes.route('/api/cart/<user_id>/clear', methods=['POST'])
def clear_cart(user_id):
    """Clear all items from cart"""
    try:
        cart = cart_controller.clear_cart(user_id)
        if cart is None:
            return jsonify({"message": "Cart not found"}), 404
        return jsonify(cart), 200
    except Exception as e:
        print(f"❌ Error clearing cart: {e}")
        return jsonify({"message": "Internal server error"}), 500

@cart_routes.route('/api/cart/<user_id>/checkout', methods=['POST'])
def checkout(user_id):
    """Process cart checkout"""
    try:
        result = cart_controller.checkout(user_id)
        if result.get('error'):
            return jsonify({"message": result['error']}), 400
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ Error during checkout: {e}")
        return jsonify({"message": "Internal server error"}), 500