const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'acohst_jwt_secret_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function generateApplicationNumber(id) {
  const year = new Date().getFullYear();
  const paddedId = String(id).padStart(4, '0');
  return `ACOHST/${year}/APP/${paddedId}`;
}

function generateMatricNumber(departmentCode, id) {
  const year = new Date().getFullYear();
  const paddedId = String(id).padStart(3, '0');
  return `ACOHST/${year}/${departmentCode || 'HLT'}/${paddedId}`;
}

function generatePaymentReference(type = 'FEE') {
  const time = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ACOHST-${type}-${time}-${randomStr}`;
}

function sanitizeUser(user) {
  if (!user) return null;
  const { password_hash, verification_token, reset_token, ...safeUser } = user;
  return safeUser;
}

module.exports = {
  generateToken,
  generateApplicationNumber,
  generateMatricNumber,
  generatePaymentReference,
  sanitizeUser
};
