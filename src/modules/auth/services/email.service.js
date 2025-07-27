// src/modules/auth/services/email.service.js
const nodemailer = require("nodemailer");

async function sendPasswordResetEmail(email, token) {
    const resetLink = `https://seusite.com/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Agendei" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Redefinição de senha",
        text: `Clique no link para redefinir sua senha: ${resetLink}`,
    });
}

module.exports = { sendPasswordResetEmail };
