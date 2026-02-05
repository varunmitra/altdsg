import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Creates a promo carousel from list items
 * Each item: <strong>Headline</strong> subtext [Link](/url)
 * @param {Element} promoSection The promo nav section
 */
function decoratePromoCarousel(promoSection) {
  const list = promoSection.querySelector('ul');
  if (!list) return;

  const items = [...list.querySelectorAll('li')];
  if (items.length === 0) return;

  // Create carousel container
  const carousel = document.createElement('div');
  carousel.className = 'promo-carousel';

  // Create slides container
  const slides = document.createElement('div');
  slides.className = 'promo-slides';

  items.forEach((item, index) => {
    const slide = document.createElement('div');
    slide.className = 'promo-slide';
    if (index === 0) slide.classList.add('active');

    // Separate strong (headline) from rest (subtext)
    const strong = item.querySelector('strong');
    const headline = document.createElement('span');
    headline.className = 'promo-headline';
    headline.textContent = strong ? strong.textContent : '';

    const subtext = document.createElement('span');
    subtext.className = 'promo-subtext';

    // Clone item, remove strong, get remaining content
    const clone = item.cloneNode(true);
    const cloneStrong = clone.querySelector('strong');
    if (cloneStrong) cloneStrong.remove();
    subtext.innerHTML = clone.innerHTML.trim();

    slide.append(headline, subtext);
    slides.append(slide);
  });

  // Only add arrows if multiple items
  if (items.length > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'promo-arrow promo-prev';
    prevBtn.setAttribute('aria-label', 'Previous promotion');
    prevBtn.innerHTML = '‹';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'promo-arrow promo-next';
    nextBtn.setAttribute('aria-label', 'Next promotion');
    nextBtn.innerHTML = '›';

    let currentIndex = 0;

    const showSlide = (index) => {
      const allSlides = slides.querySelectorAll('.promo-slide');
      allSlides.forEach((s, i) => {
        s.classList.toggle('active', i === index);
      });
      currentIndex = index;
    };

    prevBtn.addEventListener('click', () => {
      const newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
      showSlide(newIndex);
    });

    nextBtn.addEventListener('click', () => {
      const newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
      showSlide(newIndex);
    });

    carousel.append(prevBtn, slides, nextBtn);

    // Auto-rotate every 5 seconds
    setInterval(() => {
      const newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
      showSlide(newIndex);
    }, 5000);
  } else {
    carousel.append(slides);
  }

  // Replace list with carousel
  list.replaceWith(carousel);
}

/**
 * Toggles the mobile nav menu
 * @param {Element} nav The nav element
 * @param {boolean} forceExpanded Optional param to force nav expand state
 */
function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (button) button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
}

/**
 * Decorates the header block with 4-level navigation
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/fragments/nav/header';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // 4-level header structure:
  // Section 1: Promo banner
  // Section 2: Utility nav (top right links)
  // Section 3: Main nav (logo, search, account/cart)
  // Section 4: Category nav (product categories)
  const classes = ['promo', 'utility', 'main', 'categories'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // Decorate promo carousel
  const navPromo = nav.querySelector('.nav-promo');
  if (navPromo) {
    decoratePromoCarousel(navPromo);
  }

  // Decorate main nav - auto-generate search bar
  const navMain = nav.querySelector('.nav-main');
  if (navMain) {
    // Create a flex container for the main nav content
    const navMainInner = document.createElement('div');
    navMainInner.className = 'nav-main-inner';

    // Create proper logo container div
    const logoContainer = document.createElement('div');
    logoContainer.className = 'nav-brand';

    // Find and move the logo paragraph to the new container
    const logoWrapper = navMain.querySelector('.default-content-wrapper');
    if (logoWrapper) {
      const logoParagraph = logoWrapper.querySelector('p');
      if (logoParagraph) {
        logoContainer.appendChild(logoParagraph);
      }
      // Remove the old wrapper
      logoWrapper.remove();
    }
    navMainInner.appendChild(logoContainer);

    // Auto-generate search bar
    const searchBar = document.createElement('div');
    searchBar.className = 'nav-search';
    searchBar.innerHTML = `
      <span class="nav-search-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </span>
      <span class="nav-search-text">What are you looking for?</span>
    `;
    navMainInner.appendChild(searchBar);

    // Auto-generate account/cart links
    const accountLinks = document.createElement('div');
    accountLinks.className = 'nav-account';
    accountLinks.innerHTML = `
      <a href="/account" class="nav-account-link">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>My Account</span>
      </a>
      <a href="/cart" class="nav-cart-link">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <span>Cart</span>
      </a>
    `;
    navMainInner.appendChild(accountLinks);

    // Append the inner container to nav-main
    navMain.appendChild(navMainInner);
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav));

  // Insert hamburger into main nav section
  if (navMain) {
    navMain.prepend(hamburger);
  } else {
    nav.prepend(hamburger);
  }

  nav.setAttribute('aria-expanded', 'false');

  // set initial state and handle resize
  toggleMenu(nav, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, isDesktop.matches));

  // close menu on escape
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && nav.getAttribute('aria-expanded') === 'true' && !isDesktop.matches) {
      toggleMenu(nav, false);
      const btn = nav.querySelector('.nav-hamburger button');
      if (btn) btn.focus();
    }
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
