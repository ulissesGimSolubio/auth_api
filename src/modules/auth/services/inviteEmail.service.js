const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendInviteEmail(email, token) {
  const registerUrl = `${process.env.FRONTEND_URL}/register?token=${token}`

  const mailOptions = {
    from: `"Agendei App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Convite para registro',
    html: `
      <p>Você foi convidado a se registrar no sistema Agendei.</p>
      <p><strong>Link de Registro:</strong> <a href="${registerUrl}">${registerUrl}</a></p>
      <p>O link é válido por 24 horas.</p>
    `
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendInviteEmail
};
