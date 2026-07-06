// Лёгкий счётчик посещений: одна асинхронная "маячковая" отправка, не блокирует загрузку страницы.
(function () {
  var url = '/.netlify/functions/track';
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url);
  } else {
    fetch(url, { method: 'POST', keepalive: true }).catch(function () {});
  }
})();
