const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

// Gera segredo e URL para apps como Google Authenticator
function generateTwoFactorSecret(userEmail) {
  const secret = speakeasy.generateSecret({
    name: `Agendei (${userEmail})`
  });

  return {
    base32: secret.base32,
    otpauthUrl: secret.otpauth_url
  };
}

// Gera QR Code baseado na URL do segredo
function generateQRCode(otpauthUrl) {
  return qrcode.toDataURL(otpauthUrl);
}

// Verifica se o token informado é válido
function verifyToken(secret, token) {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1
  });
}

module.exports = {
  generateTwoFactorSecret,
  generateQRCode,
  verifyToken
};
