// Считает просмотры страниц: общее число заходов и уникальных посетителей за день.
// Хранилище — Netlify Blobs (ключ-значение, работает "из коробки" на Netlify, без внешних сервисов).
const { getStore } = require('@netlify/blobs');

const VISITOR_COOKIE = 'seen_today';

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

exports.handler = async (event) => {
  try {
    const store = getStore('site-stats');
    const key = todayKey();
    const cookieHeader = event.headers.cookie || event.headers.Cookie || '';
    const hasVisitorCookie = new RegExp(`(^|;\\s*)${VISITOR_COOKIE}=`).test(cookieHeader);

    const day = (await store.get(key, { type: 'json' })) || { views: 0, uniques: 0 };
    day.views += 1;
    if (!hasVisitorCookie) day.uniques += 1;
    await store.setJSON(key, day);

    const headers = {};
    if (!hasVisitorCookie) {
      headers['Set-Cookie'] = `${VISITOR_COOKIE}=1; Path=/; Max-Age=86400; SameSite=Lax`;
    }
    return { statusCode: 204, headers };
  } catch (err) {
    // Учёт не должен ронять сайт при любых сбоях хранилища.
    return { statusCode: 204 };
  }
};
