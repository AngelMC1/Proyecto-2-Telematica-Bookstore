from datetime import datetime

class Cart:
    def __init__(self, db):
        self.collection = db['carts']
    
    def get_cart(self, user_id):
        cart = self.collection.find_one({"user_id": user_id})
        if cart:
            cart['_id'] = str(cart['_id'])
        return cart
    
    def create_cart(self, user_id):
        cart = {
            "user_id": user_id,
            "items": [],
            "total": 0,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        }
        result = self.collection.insert_one(cart)
        cart['_id'] = str(result.inserted_id)
        return cart
    
    def add_item(self, user_id, item):
        cart = self.get_cart(user_id)
        if cart is None:
            cart = self.create_cart(user_id)
        
        existing_item = None
        for i, cart_item in enumerate(cart['items']):
            if cart_item['book_id'] == item['book_id']:
                existing_item = i
                break
        
        if existing_item is not None:
            cart['items'][existing_item]['quantity'] += item['quantity']
        else:
            cart['items'].append(item)
        
        total = sum(i['price'] * i['quantity'] for i in cart['items'])
        
        self.collection.update_one(
            {"user_id": user_id},
            {"$set": {"items": cart['items'], "total": total, "updatedAt": datetime.now()}}
        )
        
        return self.get_cart(user_id)
    
    def update_item(self, user_id, book_id, quantity):
        cart = self.get_cart(user_id)
        if cart is None:
            return None
        
        for item in cart['items']:
            if item['book_id'] == book_id:
                item['quantity'] = quantity
                break
        
        total = sum(i['price'] * i['quantity'] for i in cart['items'])
        
        self.collection.update_one(
            {"user_id": user_id},
            {"$set": {"items": cart['items'], "total": total, "updatedAt": datetime.now()}}
        )
        
        return self.get_cart(user_id)
    
    def remove_item(self, user_id, book_id):
        cart = self.get_cart(user_id)
        if cart is None:
            return None
        
        cart['items'] = [i for i in cart['items'] if i['book_id'] != book_id]
        total = sum(i['price'] * i['quantity'] for i in cart['items'])
        
        self.collection.update_one(
            {"user_id": user_id},
            {"$set": {"items": cart['items'], "total": total, "updatedAt": datetime.now()}}
        )
        
        return self.get_cart(user_id)
    
    def clear_cart(self, user_id):
        self.collection.update_one(
            {"user_id": user_id},
            {"$set": {"items": [], "total": 0, "updatedAt": datetime.now()}}
        )
        return self.get_cart(user_id)