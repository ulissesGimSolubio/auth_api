require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendPasswordResetEmail(email, token) {
  const resetLink = `https://seusite.com/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 30px; background-color: #f4f4f4; color: #333;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <h2 style="color: #007bff;">Redefinição de Senha</h2>
        <p>Olá,</p>
        <p>Você solicitou a redefinição de senha para sua conta no <strong>Agendei</strong>.</p>
        <p>Clique no botão abaixo para criar uma nova senha:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #007bff; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Redefinir Senha
          </a>
        </p>
        <p>Se você não solicitou essa alteração, apenas ignore este e-mail.</p>
        <hr style="margin-top: 30px;">
        <p style="font-size: 12px; color: #999;">Este é um e-mail automático, por favor, não responda.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"Agendei" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Redefinição de senha',
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendPasswordResetEmail };
