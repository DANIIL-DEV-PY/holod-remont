// Подпись и проверка сессионной cookie для админ-панели (HMAC-SHA256, без внешних зависимостей).
const crypto = require('crypto');

const COOKIE_NAME = 'admin_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 дней

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

function timingSafeEqualStr(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function createSessionCookie(secret) {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = String(expires);
  const token = `${payload}.${sign(payload, secret)}`;
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${MAX_AGE_SECONDS}`;
}

function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

function isValidSession(cookieHeader, secret) {
  if (!cookieHeader || !secret) return false;
  const found = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!found) return false;

  const token = found.slice(COOKIE_NAME.length + 1);
  const dotIndex = token.lastIndexOf('.');
  if (dotIndex === -1) return false;
  const payload = token.slice(0, dotIndex);
  const sig = token.slice(dotIndex + 1);

  if (!timingSafeEqualStr(sig, sign(payload, secret))) return false;
  return Number(payload) > Date.now();
}

module.exports = { createSessionCookie, clearSessionCookie, isValidSession, timingSafeEqualStr, COOKIE_NAME };
