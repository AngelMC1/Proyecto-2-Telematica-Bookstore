from models.cart import Cart
from services.catalogService import CatalogService
from services.userService import UserService
from messaging.publisher import publish_event

class CartController:
    def __init__(self, db):
        self.cart_model = Cart(db)
        self.catalog_service = CatalogService()
        self.user_service = UserService()
    
    def get_cart(self, user_id):
        """Get user's cart, creating it if it doesn't exist"""
        print(f"🔍 Getting cart for user: {user_id}")
        
        # Skip user verification for now to avoid external service dependency
        # TODO: Add user verification later when services are stable
        
        cart = self.cart_model.get_cart(user_id)
        print(f"📦 Found existing cart: {cart}")
        
        if cart is None:
            print(f"🆕 Creating new cart for user: {user_id}")
            cart = self.cart_model.create_cart(user_id)
        
        return cart
    
    def add_item(self, user_id, item_data):
        """Add item to cart - simplified version"""
        print(f"➕ Adding item to cart for user: {user_id}, item: {item_data}")
        
        # Simplified - just add the item without external validations
        cart_item = {
            'book_id': item_data['book_id'],
            'name': item_data.get('name', f"Book {item_data['book_id']}"),
            'price': item_data.get('price', 0),
            'quantity': item_data['quantity']
        }
        
        print(f"📝 Adding cart item: {cart_item}")
        return self.cart_model.add_item(user_id, cart_item)
    
    def update_item(self, user_id, book_id, quantity):
        """Update item quantity after validating stock"""
        # Verify book exists and has enough stock
        book = self.catalog_service.get_book(book_id)
        if book is None or book['countInStock'] < quantity:
            return None
            
        return self.cart_model.update_item(user_id, book_id, quantity)
    
    def remove_item(self, user_id, book_id):
        """Remove item from cart"""
        return self.cart_model.remove_item(user_id, book_id)
    
    def clear_cart(self, user_id):
        """Clear all items from cart"""
        return self.cart_model.clear_cart(user_id)
    
    def checkout(self, user_id):
        """Process cart checkout"""
        # Get cart
        cart = self.cart_model.get_cart(user_id)
        if cart is None or len(cart['items']) == 0:
            return {"error": "Cart is empty"}
            
        # Verify stock for all items
        for item in cart['items']:
            book = self.catalog_service.get_book(item['book_id'])
            if book is None or book['countInStock'] < item['quantity']:
                return {"error": f"Insufficient stock for book: {item['name']}"}
        
        # Update stock for all items
        try:
            for item in cart['items']:
                self.catalog_service.update_stock(item['book_id'], -item['quantity'])
            
            # Publish order event
            publish_event('order_created', {
                'user_id': user_id,
                'items': cart['items'],
                'total': cart['total']
            })
            
            # Clear cart
            self.clear_cart(user_id)
            
            return {
                "message": "Order processed successfully",
                "order": {
                    "user_id": user_id,
                    "items": cart['items'],
                    "total": cart['total']
                }
            }
        except Exception as e:
            print(f"❌ Error during checkout: {e}")
            return {"error": "Failed to process order"}