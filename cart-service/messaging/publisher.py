import os
import json
import pika
from dotenv import load_dotenv

load_dotenv()

def get_rabbitmq_connection():
    """Create RabbitMQ connection"""
    host = os.getenv('RABBITMQ_URL', 'rabbitmq')
    port = int(os.getenv('RABBITMQ_PORT', 5672))
    
    try:
        credentials = pika.PlainCredentials('guest', 'guest')
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host=host,
                port=port,
                credentials=credentials
            )
        )
        return connection
    except Exception as e:
        print(f"❌ Error connecting to RabbitMQ: {e}")
        return None

def publish_event(event_type, data):
    """Publish event to RabbitMQ"""
    try:
        connection = get_rabbitmq_connection()
        if connection is None:
            raise Exception("Failed to connect to RabbitMQ")
            
        channel = connection.channel()
        
        # Declare exchange
        channel.exchange_declare(
            exchange='bookstore_events',
            exchange_type='topic',
            durable=True
        )
        
        # Create message
        message = {
            "type": event_type,
            "data": data
        }
        
        # Publish message
        channel.basic_publish(
            exchange='bookstore_events',
            routing_key=event_type,
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=2  # make message persistent
            )
        )
        
        print(f"✅ Event published: {event_type}")
        connection.close()
        
    except Exception as e:
        print(f"❌ Error publishing event: {e}")
        raise e