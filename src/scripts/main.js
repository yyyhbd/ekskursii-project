import flatpickr from 'flatpickr';
import { Russian } from 'flatpickr/dist/l10n/ru.js';
import 'flatpickr/dist/flatpickr.min.css';

document.addEventListener('DOMContentLoaded', () => {
  initDatepicker();
  initBurgerMenu();
  initContactsDropdown();
  initCustomSelects(); // ← добавить
  initSmoothScroll();
  initReviewsSlider();
  initReviewToggle();
  initSearchForm();
});
// 1. Календарь Flatpickr
function initDatepicker() {
  const inputs = document.querySelectorAll('.js-datepicker');
  if (!inputs.length) return;

  flatpickr(inputs, {
    locale: Russian,
    dateFormat: 'd.m.Y',
    minDate: 'today',
    disableMobile: true,
  });
}

// 2. Бургер-меню
function initBurgerMenu() {
  const burgerBtn = document.querySelector('.js-burger');
  const navMenu = document.querySelector('.js-nav');
  if (!burgerBtn || !navMenu) return;

  const closeMenu = () => {
    navMenu.classList.remove('header__nav--active');
    burgerBtn.classList.remove('burger--active');
    burgerBtn.setAttribute('aria-expanded', 'false');
  };

  burgerBtn.addEventListener('click', () => {
    const isActive = navMenu.classList.toggle('header__nav--active');
    burgerBtn.classList.toggle('burger--active');
    burgerBtn.setAttribute('aria-expanded', String(isActive));
  });

  // Закрываем меню при клике на обычную ссылку (кроме дропдауна "Контакты")
  navMenu.querySelectorAll('.header__link:not(.js-contacts-toggle)').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

// 2b. Дропдаун "Контакты" в меню (телефон + мессенджеры)
function initContactsDropdown() {
  const toggleBtn = document.querySelector('.js-contacts-toggle');
  const dropdown = document.querySelector('.js-contacts-dropdown');
  if (!toggleBtn || !dropdown) return;

  const closeDropdown = () => {
    dropdown.classList.remove('header__dropdown--active');
    toggleBtn.setAttribute('aria-expanded', 'false');
  };

  const openDropdown = () => {
    dropdown.classList.add('header__dropdown--active');
    toggleBtn.setAttribute('aria-expanded', 'true');
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('header__dropdown--active');
    isOpen ? closeDropdown() : openDropdown();
  });

  // Закрытие по клику вне дропдауна
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== toggleBtn) {
      closeDropdown();
    }
  });

  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDropdown();
  });
}

// 3. Плавный скролл к расписанию
function initSmoothScroll() {
  const scrollBtns = document.querySelectorAll('.js-scroll-to-schedule');
  const scheduleSection = document.getElementById('schedule');
  const navMenu = document.querySelector('.js-nav');
  const burgerBtn = document.querySelector('.js-burger');
  if (!scheduleSection) return;

  scrollBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      scheduleSection.scrollIntoView({ behavior: 'smooth' });

      if (navMenu?.classList.contains('header__nav--active')) {
        navMenu.classList.remove('header__nav--active');
        burgerBtn?.classList.remove('burger--active');
      }
    });
  });
}

// 4. Слайдер отзывов
function initReviewsSlider() {
  const track = document.querySelector('.js-reviews-track');
  const prevBtn = document.querySelector('.js-slider-prev');
  const nextBtn = document.querySelector('.js-slider-next');
  if (!track || !prevBtn || !nextBtn) return;

  let currentIndex = 0;

  const getMaxIndex = () => {
    const perView = window.innerWidth >= 1024 ? 2 : 1;
    return Math.max(track.children.length - perView, 0);
  };

  const updateSlider = () => {
    const cards = track.children;
    if (cards.length === 0) return;

    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const cardWidth = cards[0].offsetWidth + gap;
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= getMaxIndex();
  };

  nextBtn.addEventListener('click', () => {
    if (currentIndex < getMaxIndex()) {
      currentIndex++;
      updateSlider();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  window.addEventListener('resize', () => {
    currentIndex = Math.min(currentIndex, getMaxIndex());
    updateSlider();
  });

  updateSlider();
}

// 5. Разворачивание длинного текста отзыва.
// Кнопка "далее..." показывается только если текст реально
// не помещается в 4 строки (line-clamp) — иначе она скрыта.
function initReviewToggle() {
  const reviewCards = document.querySelectorAll('.review-card');
  if (!reviewCards.length) return;

  const cards = Array.from(reviewCards).map((card) => ({
    card,
    toggleBtn: card.querySelector('.js-review-toggle'),
    text: card.querySelector('.review-card__text'),
  })).filter(({ toggleBtn, text }) => toggleBtn && text);

  const syncVisibility = () => {
    cards.forEach(({ toggleBtn, text }) => {
      // Пока текст свёрнут, clientHeight ограничен line-clamp'ом;
      // scrollHeight — это полная высота содержимого без обрезки.
      const wasExpanded = text.classList.contains('review-card__text--expanded');
      if (wasExpanded) text.classList.remove('review-card__text--expanded');

      const isOverflowing = text.scrollHeight - text.clientHeight > 1;
      toggleBtn.classList.toggle('review-card__toggle--visible', isOverflowing);

      if (wasExpanded) text.classList.add('review-card__text--expanded');
    });
  };

  cards.forEach(({ toggleBtn, text }) => {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = text.classList.toggle('review-card__text--expanded');
      toggleBtn.textContent = isExpanded ? 'свернуть' : 'далее...';
    });
  });

  syncVisibility();
  window.addEventListener('resize', syncVisibility);
}

// 6. Обработка формы поиска без отправки на сервер
function initSearchForm() {
  const searchForm = document.querySelector('.js-search-form');
  if (!searchForm) return;

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(searchForm);
    const values = Object.fromEntries(formData.entries());
    console.log('Поиск экскурсий выполнен:', values);
  });
}
function initCustomSelects() {
  const selects = document.querySelectorAll('.js-select');

  selects.forEach((select) => {
    const button = select.querySelector('.js-select-button');
    const value = select.querySelector('.js-select-value');
    const items = select.querySelectorAll('.header__select-item');

    button.addEventListener('click', (e) => {
      e.stopPropagation();

      // закрываем остальные списки
      document.querySelectorAll('.js-select').forEach((s) => {
        if (s !== select) {
          s.classList.remove('header__custom-select--active');
        }
      });

      select.classList.toggle('header__custom-select--active');
    });

    items.forEach((item) => {
      item.addEventListener('click', () => {
        items.forEach((i) =>
          i.classList.remove('header__select-item--active')
        );

        item.classList.add('header__select-item--active');
        value.textContent = item.textContent;

        select.classList.remove('header__custom-select--active');
      });
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.js-select').forEach((select) => {
      select.classList.remove('header__custom-select--active');
    });
  });
}