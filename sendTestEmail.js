// sendTestEmail.js
require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendTestEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Agendei API" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // envia para você mesmo
      subject: 'Teste de envio de e-mail',
      text: 'Este é um e-mail de teste da API Agendei',
    });

    console.log('E-mail enviado com sucesso:', info.messageId);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error.message);
  }
}

sendTestEmail();
