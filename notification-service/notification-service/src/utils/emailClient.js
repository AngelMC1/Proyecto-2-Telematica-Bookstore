export const EmailClient = {
  async send(to, subject, message) {
    // Aquí puedes integrar SendGrid, Nodemailer, AWS SES, etc.
    console.log(`Email enviado a: ${to}`);
    console.log(`Asunto: ${subject}`);
    console.log(`Mensaje: ${message}`);

    // Simulamos respuesta
    return { status: 'sent', to, subject };
  }
};
