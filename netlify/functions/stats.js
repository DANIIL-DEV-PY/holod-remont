const { getStore } = require('@netlify/blobs');
const { isValidSession } = require('./lib/auth');

function dateKey(d) {
  return d.toISOString().slice(0, 10);
}

function sumViews(days) {
  return days.reduce((acc, d) => acc + d.views, 0);
}

function sumUniques(days) {
  return days.reduce((acc, d) => acc + d.uniques, 0);
}

exports.handler = async (event) => {
  const secret = process.env.SESSION_SECRET;
  const cookieHeader = event.headers.cookie || event.headers.Cookie || '';
  if (!isValidSession(cookieHeader, secret)) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const store = getStore('site-stats');
  const totalDays = 30;
  const today = new Date();
  const daily = [];

  for (let i = totalDays - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const key = dateKey(d);
    const data = (await store.get(key, { type: 'json' })) || { views: 0, uniques: 0 };
    daily.push({ date: key, views: data.views, uniques: data.uniques });
  }

  const last7 = daily.slice(-7);
  const prev7 = daily.slice(-14, -7);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      daily,
      today: daily[daily.length - 1],
      thisWeek: { views: sumViews(last7), uniques: sumUniques(last7) },
      lastWeek: { views: sumViews(prev7), uniques: sumUniques(prev7) },
    }),
  };
};
