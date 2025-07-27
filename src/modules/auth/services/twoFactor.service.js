const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

function generate2FASecret(username) {
  const secret = speakeasy.generateSecret({
    name: `Agendei (${username})`
  });
  return secret;
}

function getQRCode(otpauth_url) {
  return qrcode.toDataURL(otpauth_url);
}

function verify2FAToken(secret, token) {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token
  });
}

module.exports = {
  generate2FASecret,
  getQRCode,
  verify2FAToken
};
