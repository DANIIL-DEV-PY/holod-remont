// Единый источник данных об услугах.
// Используется и лентой на главной (js/script.js), и страницами услуг.
// Цены — плейсхолдеры, замените на свои реальные.
window.SERVICES = [
  {
    id: 1,
    slug: 'diagnostika',
    icon: '🔍',
    name: 'Диагностика холодильника',
    price: 'от 500 ₽',
    shortDesc: 'Точное определение неисправности выездом на дом.',
  },
  {
    id: 2,
    slug: 'zapravka-freonom',
    icon: '❄️',
    name: 'Заправка фреоном',
    price: 'от 1500 ₽',
    shortDesc: 'Восстановление холода при утечке хладагента.',
  },
  {
    id: 3,
    slug: 'zamena-kompressora',
    icon: '⚙️',
    name: 'Замена компрессора',
    price: 'от 3500 ₽',
    shortDesc: 'Установка нового компрессора с гарантией.',
  },
  {
    id: 4,
    slug: 'remont-stiralnoy-mashiny',
    icon: '🌀',
    name: 'Ремонт стиральных машин',
    price: 'от 1200 ₽',
    shortDesc: 'Устранение протечек, шума, ошибок на дисплее.',
  },
  {
    id: 5,
    slug: 'remont-posudomoechnoy-mashiny',
    icon: '🍽️',
    name: 'Ремонт посудомоечных машин',
    price: 'от 1200 ₽',
    shortDesc: 'Не набирает воду, не сливает, не моет — починим.',
  },
  {
    id: 6,
    slug: 'remont-duhovogo-shkafa-plity',
    icon: '🔥',
    name: 'Ремонт духовых шкафов и плит',
    price: 'от 1000 ₽',
    shortDesc: 'Электрические и газовые плиты, духовые шкафы.',
  },
];
