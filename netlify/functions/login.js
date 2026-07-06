const crypto = require('crypto');
const { createSessionCookie, timingSafeEqualStr } = require('./lib/auth');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;
  if (!adminPassword || !secret) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Админ-панель не настроена: нет ADMIN_PASSWORD/SESSION_SECRET' }) };
  }

  let password = '';
  try {
    password = JSON.parse(event.body || '{}').password || '';
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Некорректный запрос' }) };
  }

  // Паддинг до одинаковой длины, чтобы сравнение не утекало через exception на разной длине буферов.
  const a = crypto.createHash('sha256').update(password).digest();
  const b = crypto.createHash('sha256').update(adminPassword).digest();
  if (!timingSafeEqualStr(a.toString('hex'), b.toString('hex'))) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Неверный пароль' }) };
  }

  return {
    statusCode: 200,
    headers: {
      'Set-Cookie': createSessionCookie(secret),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ok: true }),
  };
};
