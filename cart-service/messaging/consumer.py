import os
import json
import threading
import pika
from dotenv import load_dotenv

load_dotenv()

class RabbitMQConsumer(threading.Thread):
    def __init__(self):
        super().__init__()
        self.host = os.getenv('RABBITMQ_URL', 'rabbitmq')
        self.port = int(os.getenv('RABBITMQ_PORT', 5672))
        self.should_stop = False
        
    def setup_connection(self):
        """Setup RabbitMQ connection and channel"""
        credentials = pika.PlainCredentials('guest', 'guest')
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host=self.host,
                port=self.port,
                credentials=credentials
            )
        )
        self.channel = self.connection.channel()
        
        # Declare exchange
        self.channel.exchange_declare(
            exchange='bookstore_events',
            exchange_type='topic',
            durable=True
        )
        
        # Declare queue
        result = self.channel.queue_declare(
            queue='cart_service_queue',
            durable=True
        )
        
        # Bind queue to exchange with relevant routing keys
        routing_keys = ['stock.updated', 'user.deleted']
        for key in routing_keys:
            self.channel.queue_bind(
                exchange='bookstore_events',
                queue=result.method.queue,
                routing_key=key
            )
            
        return result.method.queue
    
    def handle_message(self, ch, method, properties, body):
        """Handle incoming messages"""
        try:
            message = json.loads(body)
            event_type = message.get('type')
            data = message.get('data')
            
            print(f"📨 Received event: {event_type}")
            
            if event_type == 'stock.updated':
                # Handle stock update
                print(f"📦 Stock updated for book {data['book_id']}: {data['new_stock']}")
                
            elif event_type == 'user.deleted':
                # Handle user deletion - could clear their cart
                print(f"🗑️ User deleted: {data['user_id']}")
                # TODO: Implement cart deletion logic
                
            ch.basic_ack(delivery_tag=method.delivery_tag)
            
        except json.JSONDecodeError as e:
            print(f"❌ Error decoding message: {e}")
            ch.basic_nack(delivery_tag=method.delivery_tag)
            
        except Exception as e:
            print(f"❌ Error processing message: {e}")
            ch.basic_nack(delivery_tag=method.delivery_tag)
    
    def run(self):
        """Start consuming messages"""
        try:
            queue_name = self.setup_connection()
            
            print("✅ RabbitMQ Consumer started")
            
            self.channel.basic_qos(prefetch_count=1)
            self.channel.basic_consume(
                queue=queue_name,
                on_message_callback=self.handle_message
            )
            
            self.channel.start_consuming()
            
        except Exception as e:
            print(f"❌ Consumer error: {e}")
            if not self.should_stop:
                self.run()  # Retry connection
    
    def stop(self):
        """Stop consuming messages"""
        self.should_stop = True
        if self.channel:
            self.channel.stop_consuming()
        if self.connection:
            self.connection.close()