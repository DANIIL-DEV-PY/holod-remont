// Рендер ленты услуг + логика модалки «Связаться с нами».
// Запускается после того, как components.js вставил хедер/футер/модалку.

(function () {
  function initServicesMarquee(base) {
    var track = document.getElementById('services-track');
    if (!track || !window.SERVICES) return;

    function cardHtml(s) {
      return (
        '<article class="service-card">' +
        '<div class="service-icon" aria-hidden="true">' + s.icon + '</div>' +
        '<h3>' + s.name + '</h3>' +
        '<p style="color:var(--color-text-muted);font-size:13px;">' + s.shortDesc + '</p>' +
        '<div class="service-price">' + s.price + '</div>' +
        '<a class="service-link" href="' + base + 'services/' + s.slug + '.html">Подробнее →</a>' +
        '</article>'
      );
    }

    // Дублируем список дважды — для бесшовной прокрутки (translateX(-50%)).
    var once = window.SERVICES.map(cardHtml).join('');
    track.innerHTML = once + once;
    // aria-hidden на дубликат не ставим отдельно (простые карточки),
    // но клонированные ссылки корректны — ведут на те же страницы.
  }

  function initContactModal() {
    var modal = document.getElementById('contact-modal');
    if (!modal) return;
    var closeBtn = modal.querySelector('.modal-close');
    var lastFocused = null;

    function open(trigger) {
      lastFocused = trigger || document.activeElement;
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      var firstLink = modal.querySelector('a, button');
      if (firstLink) firstLink.focus();
    }

    function close() {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    // Открытие по любой кнопке с data-open-contact
    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-open-contact]');
      if (opener) {
        e.preventDefault();
        open(opener);
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', close);

    // Клик по оверлею (вне карточки)
    modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });

    // Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) close();
    });
  }

  window.initSite = function (base) {
    base = base || '';
    renderComponents(base);
    initServicesMarquee(base);
    initContactModal();
  };
})();
