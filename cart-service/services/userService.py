import os
import requests
from dotenv import load_dotenv

load_dotenv()

class UserService:
    def __init__(self):
        self.base_url = os.getenv('USER_SERVICE_URL')
        if self.base_url is None:
            raise Exception("USER_SERVICE_URL not configured")
    
    def get_user(self, user_id):
        """Get user details from user service"""
        try:
            response = requests.get(f"{self.base_url}/api/users/{user_id}")
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            print(f"❌ Error getting user from user service: {e}")
            return None