const { clearSessionCookie } = require('./lib/auth');

exports.handler = async () => ({
  statusCode: 200,
  headers: {
    'Set-Cookie': clearSessionCookie(),
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ ok: true }),
});
