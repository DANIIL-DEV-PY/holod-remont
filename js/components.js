// Общий хедер/футер + плавающая кнопка и модалка связи.
// Вставляется через innerHTML, чтобы работало и при открытии файла напрямую (file://),
// где fetch() запрещён. Параметр base — префикс путей ('' на главной, '../' на страницах услуг).

// ВАЖНО: замените плейсхолдеры на реальные контакты.
window.CONTACTS = {
  phoneDisplay: '+7 (999) 123-45-67', // TODO: ваш реальный номер
  phoneHref: '+79991234567', // TODO: тот же номер в формате для tel:
  vk: 'https://vk.com/example', // TODO: ссылка на ваш профиль/сообщество ВК
};

function renderComponents(base) {
  base = base || '';

  const header = document.getElementById('site-header');
  if (header) {
    header.innerHTML = `
      <div class="container">
        <a class="logo" href="${base}index.html" aria-label="На главную">
          <span class="logo-icon" aria-hidden="true">🧊</span>
          <span>ХолодСервис</span>
        </a>
        <button class="btn btn-outline header-cta" data-open-contact>Связаться</button>
      </div>`;
  }

  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.innerHTML = `
      <div class="container">
        <strong>ХолодСервис</strong> — ремонт холодильного оборудования и бытовой техники
        <span>Телефон: <a href="tel:${window.CONTACTS.phoneHref}">${window.CONTACTS.phoneDisplay}</a></span>
        <span>Мы во ВКонтакте: <a href="${window.CONTACTS.vk}" target="_blank" rel="noopener">vk.com</a></span>
        <span style="opacity:.7;font-size:12px;">Выезд на дом · Гарантия на работы · Оплата после ремонта</span>
      </div>`;
  }

  // Плавающая кнопка «Связаться»
  const fab = document.createElement('button');
  fab.className = 'btn btn-primary contact-fab';
  fab.type = 'button';
  fab.setAttribute('data-open-contact', '');
  fab.innerHTML = '<span aria-hidden="true">📞</span> Связаться';
  document.body.appendChild(fab);

  // Модальное окно связи
  const modal = document.createElement('div');
  modal.className = 'modal-overlay hidden';
  modal.id = 'contact-modal';
  modal.innerHTML = `
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
      <button class="modal-close" type="button" aria-label="Закрыть окно">&times;</button>
      <h2 id="contact-modal-title">Связаться с нами</h2>
      <p class="modal-subtitle">Ответим на вопросы и подберём удобное время выезда.</p>
      <div class="modal-contact-list">
        <a href="tel:${window.CONTACTS.phoneHref}">
          <span class="contact-icon" aria-hidden="true">📞</span>
          <span>${window.CONTACTS.phoneDisplay}</span>
        </a>
        <a href="${window.CONTACTS.vk}" target="_blank" rel="noopener">
          <span class="contact-icon" aria-hidden="true">💬</span>
          <span>Написать во ВКонтакте</span>
        </a>
      </div>
      <p class="modal-note">Работаем ежедневно с 8:00 до 22:00.</p>
    </div>`;
  document.body.appendChild(modal);
}
