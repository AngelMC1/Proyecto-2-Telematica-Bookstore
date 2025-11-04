import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI')

def connect_db():
    try:
        if MONGO_URI is None or MONGO_URI == '':
            raise Exception("MONGO_URI not configured")
            
        client = MongoClient(MONGO_URI)
        client.admin.command('ping')
        db = client['bookstore']
        print(f"✅ MongoDB connected successfully")
        return db
    except Exception as e:
        print(f"❌ Error connecting to MongoDB: {e}")
        return None