import os
import requests
from dotenv import load_dotenv

load_dotenv()

class CatalogService:
    def __init__(self):
        self.base_url = os.getenv('CATALOG_SERVICE_URL')
        if self.base_url is None:
            raise Exception("CATALOG_SERVICE_URL not configured")
    
    def get_book(self, book_id):
        """Get book details from catalog service"""
        try:
            response = requests.get(f"{self.base_url}/api/books/{book_id}")
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            print(f"❌ Error getting book from catalog service: {e}")
            return None
    
    def update_stock(self, book_id, quantity_change):
        """Update book stock in catalog service"""
        try:
            response = requests.put(
                f"{self.base_url}/api/books/{book_id}/stock",
                json={"quantity_change": quantity_change}
            )
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            print(f"❌ Error updating stock in catalog service: {e}")
            raise Exception("Failed to update stock")