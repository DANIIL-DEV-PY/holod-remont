// Рендер списка услуг + логика модалки «Связаться с нами».
// Запускается после того, как components.js вставил хедер/футер/модалку.

(function () {
  function initServicesList(base) {
    var list = document.getElementById('services-list');
    if (!list || !window.SERVICES) return;

    function cardHtml(s, index) {
      return (
        '<article class="service-card" data-reveal style="--stack-i:' + index + '">' +
        '<div class="service-icon" aria-hidden="true">' + s.icon + '</div>' +
        '<h3>' + s.name + '</h3>' +
        '<p class="service-desc">' + s.shortDesc + '</p>' +
        '<div class="service-price">' + s.price + '</div>' +
        '<a class="service-link" href="' + base + 'services/' + s.slug + '.html">Узнать больше →</a>' +
        '</article>'
      );
    }

    // --stack-i задаёт нарастающее смещение sticky-карточек на мобильных
    // (см. .service-card в css/styles.css) — на десктопе игнорируется (обычная сетка).
    list.innerHTML = window.SERVICES.map(cardHtml).join('');
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Появление заголовков/карточек при скролле — один раз для каждого элемента.
  function initScrollReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    els.forEach(function (el) { observer.observe(el); });
  }

  // Анимация нарастающих чисел в блоке статистики.
  function initStatsCounters() {
    var els = document.querySelectorAll('[data-count-to]');
    if (!els.length) return;

    function setFinal(el) {
      el.textContent = el.getAttribute('data-count-to') + (el.getAttribute('data-suffix') || '');
    }

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      els.forEach(setFinal);
      return;
    }

    function animate(el) {
      var target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1200;
      var start = null;

      function step(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // ease-out
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) window.requestAnimationFrame(step);
      }

      window.requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    els.forEach(function (el) { observer.observe(el); });
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
    initServicesList(base);
    initScrollReveal();
    initStatsCounters();
    initContactModal();
  };
})();
