# Bookstore - Plataforma de Librerías con Microservicios

Una plataforma moderna de comercio electrónico para librerías, desarrollada con arquitectura de microservicios. Permite a los usuarios explorar catálogos de libros, gestionar carritos de compras y recibir notificaciones en tiempo real.

## Descripción General

**Bookstore** es una aplicación web que simula una librería en línea, construida con una arquitectura de microservicios distribuidos.  
El sistema permite a los usuarios registrarse, autenticarse, explorar un catálogo, añadir productos a su carrito y recibir notificaciones.  
Está diseñada para ser escalable, mantenible y resiliente, utilizando tecnologías como Docker, MongoDB y RabbitMQ.

## Arquitectura General

La aplicación está compuesta por **cinco microservicios independientes** que se comunican entre sí mediante diferentes protocolos.

### Servicios Principales

- **User Service (Puerto 5002)** – Gestión de usuarios y autenticación  
- **Catalog Service (Puerto 5001)** – Catálogo de libros e inventario  
- **Cart Service (Puerto 5004)** – Carrito de compras y checkout  
- **Notification Service (Puerto 5003)** – Sistema de notificaciones  
- **Frontend (Puerto 3000)** – Interfaz de usuario en React

### Servicios de Infraestructura

- **RabbitMQ (Puertos 5672/15672)** – Message broker para comunicación asíncrona  
- **MongoDB** – Base de datos NoSQL compartida

### Protocolos de Comunicación

- **HTTP/REST** – Comunicación cliente-servidor  
- **gRPC** – Comunicación entre User y Catalog Service  
- **RabbitMQ** – Eventos asíncronos para acciones del sistema


## Tecnologías Principales

### Backend
- Node.js (Express.js) – User, Catalog, Notification Services  
- Python (Flask) – Cart Service  
- MongoDB – Base de datos NoSQL  
- RabbitMQ – Mensajería AMQP  
- gRPC – Comunicación de alta velocidad  
- Docker & Docker Compose – Contenedorización

### Frontend
- React 19  
- React Router  
- React Bootstrap  
- Axios  
- Nginx como servidor web

### DevOps y Herramientas
- Docker Compose  
- Concurrently  
- Nodemon  
- CORS  



## Configuración y Ejecución

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
MONGO_URI=mongodb+srv://usuario:contraseña@cluster0.mongodb.net/bookstore
USER_SERVICE_URL=http://localhost:5002
CATALOG_SERVICE_URL=http://localhost:5001
CART_SERVICE_URL=http://localhost:5004
NOTIFICATION_SERVICE_URL=http://localhost:5003
```

## Ejecución con Docker Compose

Requisitos previos:

Docker Desktop

Docker Compose v3.9 o superior

#Comandos para la terminal
```
git clone https://github.com/AngelMC1/Proyecto-2-Telematica-Bookstore.git
cd Proyecto-2-Telematica-Bookstore-main
docker compose up --build
```
Servicios disponibles:

Frontend → http://localhost:3000

RabbitMQ → http://localhost:15672
 (guest / guest)



