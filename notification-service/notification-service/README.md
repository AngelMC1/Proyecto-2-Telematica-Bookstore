Usar en una petición tipo POST: http://localhost:4000/api/notifications/send
Luego en el body pegar el siguiente contenido para testear:
    {
  "to": "usuario@ejemplo.com",
  "subject": "Bienvenido",
  "message": "Tu registro fue exitoso"
}
Para correrlo: npm run dev